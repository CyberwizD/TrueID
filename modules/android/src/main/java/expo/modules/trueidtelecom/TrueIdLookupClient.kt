package expo.modules.trueidtelecom

import java.io.BufferedReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

data class CallerOverlayPayload(
  val phoneNumber: String,
  val name: String,
  val location: String,
  val spam: Boolean,
  val confidence: Int,
  val spamScore: Int,
)

object TrueIdLookupClient {
  fun lookupPhoneNumber(context: android.content.Context, phoneNumber: String): CallerOverlayPayload? {
    val baseUrl = TrueIdTelecomPreferences.getApiBaseUrl(context)?.trim()?.trimEnd('/') ?: return null
    val endpoint = buildLookupUrl(baseUrl)
    val connection = (URL(endpoint).openConnection() as HttpURLConnection).apply {
      requestMethod = "POST"
      connectTimeout = 1500
      readTimeout = 2000
      doInput = true
      doOutput = true
      setRequestProperty("Content-Type", "application/json")
    }

    return try {
      val requesterId = TrueIdTelecomPreferences.getUserPhoneNumber(context)
      val json = JSONObject().put("phone_number", phoneNumber)
      if (!requesterId.isNullOrBlank()) {
        json.put("requester_id", requesterId)
      }
      val body = json.toString()
      OutputStreamWriter(connection.outputStream, Charsets.UTF_8).use { writer ->
        writer.write(body)
      }

      if (connection.responseCode !in 200..299) {
        null
      } else {
        val responseBody = BufferedReader(connection.inputStream.reader(Charsets.UTF_8)).use { it.readText() }
        val json = JSONObject(responseBody)
        CallerOverlayPayload(
          phoneNumber = json.optString("phone_number", phoneNumber),
          name = json.optString("name", "Unknown caller"),
          location = json.optString("location", "Nigeria"),
          spam = json.optBoolean("spam", false),
          confidence = json.optInt("confidence", 0),
          spamScore = json.optInt("spam_score", 0),
        )
      }
    } catch (_: Exception) {
      null
    } finally {
      connection.disconnect()
    }
  }

  private fun buildLookupUrl(baseUrl: String): String {
    return when {
      baseUrl.endsWith("/lookup") -> baseUrl
      baseUrl.endsWith("/api/v1") -> "$baseUrl/lookup"
      else -> "$baseUrl/api/v1/lookup"
    }
  }
}
