package expo.modules.trueidtelecom

import android.os.Handler
import android.os.Looper
import android.telecom.Call
import android.telecom.CallScreeningService
import kotlin.concurrent.thread

class TrueIdCallScreeningService : CallScreeningService() {
  override fun onScreenCall(callDetails: Call.Details) {
    respondToCall(callDetails, allowCallResponse())

    val incomingNumber = callDetails.handle?.schemeSpecificPart?.trim().orEmpty()
    if (incomingNumber.isBlank()) {
      return
    }

    thread(name = "trueid-caller-lookup") {
      val payload = TrueIdLookupClient.lookupPhoneNumber(applicationContext, incomingNumber) ?: return@thread
      Handler(Looper.getMainLooper()).post {
        CallerOverlayActivity.launch(applicationContext, payload)
      }
    }
  }

  private fun allowCallResponse(): CallResponse {
    return CallResponse.Builder()
      .setDisallowCall(false)
      .setRejectCall(false)
      .setSilenceCall(false)
      .setSkipCallLog(false)
      .setSkipNotification(false)
      .build()
  }
}
