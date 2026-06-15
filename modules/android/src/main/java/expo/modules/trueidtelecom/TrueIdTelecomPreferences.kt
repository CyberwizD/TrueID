package expo.modules.trueidtelecom

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

object TrueIdTelecomPreferences {
  private const val PREFS_NAME = "TrueIdTelecomPreferences"
  private const val KEY_API_BASE_URL = "api_base_url"
  private const val KEY_USER_PHONE_NUMBER = "user_phone_number"
  private const val META_DATA_API_BASE_URL = "expo.modules.trueidtelecom.API_BASE_URL"

  fun getApiBaseUrl(context: Context): String? {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getString(KEY_API_BASE_URL, null) ?: getManifestApiBaseUrl(context)
  }

  fun setApiBaseUrl(context: Context, url: String?) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(KEY_API_BASE_URL, url?.trim()?.trimEnd('/')).apply()
  }

  fun getUserPhoneNumber(context: Context): String? {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    return prefs.getString(KEY_USER_PHONE_NUMBER, null)
  }

  fun setUserPhoneNumber(context: Context, number: String?) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(KEY_USER_PHONE_NUMBER, number).apply()
  }

  private fun getManifestApiBaseUrl(context: Context): String? {
    return try {
      val appInfo = context.packageManager.getApplicationInfo(context.packageName, PackageManager.GET_META_DATA)
      appInfo.metaData?.getString(META_DATA_API_BASE_URL)
    } catch (_: Exception) {
      null
    }
  }


  fun hasPhoneStatePermission(context: Context): Boolean {
    return ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED
  }

  fun hasCallLogPermission(context: Context): Boolean {
    return ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_CALL_LOG) == PackageManager.PERMISSION_GRANTED
  }

  fun hasAnswerPhoneCallsPermission(context: Context): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ContextCompat.checkSelfPermission(context, android.Manifest.permission.ANSWER_PHONE_CALLS) == PackageManager.PERMISSION_GRANTED
    } else {
      true // Pre-Oreo, we can use older telephony reflection (or it's not strictly required)
    }
  }
}
