package expo.modules.trueidtelecom

import android.app.role.RoleManager
import android.content.Context
import android.os.Build

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

  fun hasCallScreeningRole(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      return false
    }
    val roleManager = context.getSystemService(RoleManager::class.java)
    return roleManager?.isRoleHeld(RoleManager.ROLE_CALL_SCREENING) == true
  }
}
