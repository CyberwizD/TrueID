package expo.modules.trueidtelecom

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
        "phoneStatePermissionGranted" to TrueIdTelecomPreferences.hasPhoneStatePermission(context),
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
