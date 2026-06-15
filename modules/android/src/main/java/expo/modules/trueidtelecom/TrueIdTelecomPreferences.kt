package expo.modules.trueidtelecom

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

object TrueIdTelecomPreferences {
  private const val PREFS_NAME = "trueid_telecom_prefs"
  private const val API_BASE_URL_KEY = "api_base_url"
  private const val META_DATA_API_BASE_URL = "expo.modules.trueidtelecom.API_BASE_URL"

  fun getApiBaseUrl(context: Context): String? {
    val sharedPrefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val overridden = sharedPrefs.getString(API_BASE_URL_KEY, null)
    if (!overridden.isNullOrBlank()) {
      return overridden
    }

    return try {
      val appInfo = context.packageManager.getApplicationInfo(context.packageName, android.content.pm.PackageManager.GET_META_DATA)
      appInfo.metaData?.getString(META_DATA_API_BASE_URL)
    } catch (_: Exception) {
      null
    }
  }

  fun setApiBaseUrl(context: Context, apiBaseUrl: String) {
    context
      .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString(API_BASE_URL_KEY, apiBaseUrl.trim().trimEnd('/'))
      .apply()
  }

  fun hasPhoneStatePermission(context: Context): Boolean {
    val phoneState = ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED
    val callLog = ContextCompat.checkSelfPermission(context, android.Manifest.permission.READ_CALL_LOG) == PackageManager.PERMISSION_GRANTED
    return phoneState && callLog
  }
}
