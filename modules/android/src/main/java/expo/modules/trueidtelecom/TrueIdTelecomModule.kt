package expo.modules.trueidtelecom

import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TrueIdTelecomModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("TrueIdTelecom")

    Events("onCallerIdentified")

    AsyncFunction("setApiBaseUrlAsync") { apiBaseUrl: String ->
      val context = appContext.reactContext ?: throw IllegalStateException("React context unavailable.")
      TrueIdTelecomPreferences.setApiBaseUrl(context, apiBaseUrl)
    }

    AsyncFunction("getStatusAsync") {
      val context = appContext.reactContext ?: throw IllegalStateException("React context unavailable.")
      mapOf(
        "platform" to "android",
        "apiBaseUrl" to TrueIdTelecomPreferences.getApiBaseUrl(context),
        "backendConfigured" to !TrueIdTelecomPreferences.getApiBaseUrl(context).isNullOrBlank(),
        "callScreeningRoleHeld" to TrueIdTelecomPreferences.hasCallScreeningRole(context),
        "nativeAvailable" to true,
      )
    }

    AsyncFunction("openCallScreeningRoleRequestAsync") {
      val activity = appContext.currentActivity ?: throw IllegalStateException("Foreground activity unavailable.")

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
        throw IllegalStateException("Call screening role requires Android 10 or newer.")
      }

      val roleManager = activity.getSystemService(RoleManager::class.java)
      val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
      activity.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    AsyncFunction("showCallerOverlayAsync") {
        phoneNumber: String,
        name: String,
        location: String,
        spam: Boolean,
        confidence: Int,
        spamScore: Int ->
      val context = appContext.reactContext ?: throw IllegalStateException("React context unavailable.")
      val payload = CallerOverlayPayload(
        phoneNumber = phoneNumber,
        name = name,
        location = location,
        spam = spam,
        confidence = confidence,
        spamScore = spamScore,
      )
      CallerOverlayActivity.launch(context, payload)
      sendEvent(
        "onCallerIdentified",
        mapOf(
          "phoneNumber" to phoneNumber,
          "name" to name,
          "location" to location,
          "spam" to spam,
          "confidence" to confidence,
          "spamScore" to spamScore,
        ),
      )
    }
  }
}
