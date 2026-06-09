package expo.modules.trueidtelecom

import android.app.role.RoleManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
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
        "sdkInt" to Build.VERSION.SDK_INT,
        "apiBaseUrl" to TrueIdTelecomPreferences.getApiBaseUrl(context),
        "backendConfigured" to !TrueIdTelecomPreferences.getApiBaseUrl(context).isNullOrBlank(),
        "callScreeningRoleHeld" to TrueIdTelecomPreferences.hasCallScreeningRole(context),
        "callScreeningRoleAvailable" to TrueIdTelecomPreferences.isCallScreeningRoleAvailable(context),
        "canDrawOverlays" to if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) Settings.canDrawOverlays(context) else true,
        "nativeAvailable" to true,
      )
    }

    AsyncFunction("requestOverlayPermissionAsync") {
      val activity = appContext.currentActivity ?: throw IllegalStateException("Foreground activity unavailable.")
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        if (!Settings.canDrawOverlays(activity)) {
          val intent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:${activity.packageName}")
          )
          activity.startActivity(intent)
        }
      }
    }

    AsyncFunction("openCallScreeningRoleRequestAsync") {
      val activity = appContext.currentActivity ?: throw IllegalStateException("Foreground activity unavailable.")

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
        throw IllegalStateException("Call screening role requires Android 10 or newer.")
      }

      val roleManager = activity.getSystemService(RoleManager::class.java)
      if (roleManager?.isRoleAvailable(RoleManager.ROLE_CALL_SCREENING) != true) {
        throw IllegalStateException("Call screening role is not available on this device (possibly restricted by the manufacturer).")
      }
      val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
      activity.startActivity(intent)
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
