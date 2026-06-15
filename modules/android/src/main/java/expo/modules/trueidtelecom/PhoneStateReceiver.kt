package expo.modules.trueidtelecom

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.telephony.TelephonyManager
import kotlin.concurrent.thread

class PhoneStateReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
      return
    }

    val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
    if (state != TelephonyManager.EXTRA_STATE_RINGING) {
      return
    }

    val incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)
    if (incomingNumber.isNullOrBlank()) {
      return
    }

    thread(name = "trueid-caller-lookup") {
      val payload = TrueIdLookupClient.lookupPhoneNumber(context, incomingNumber) ?: return@thread
      Handler(Looper.getMainLooper()).post {
        CallerOverlayActivity.launch(context, payload)
      }
    }
  }
}
