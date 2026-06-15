package expo.modules.trueidtelecom

import android.annotation.SuppressLint
import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.telecom.TelecomManager
import android.telephony.TelephonyManager
import android.view.Gravity
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat

class CallerOverlayActivity : Activity() {

  private val callStateReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
      if (intent?.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
        if (state == TelephonyManager.EXTRA_STATE_IDLE || state == TelephonyManager.EXTRA_STATE_OFFHOOK) {
          finish()
        }
      }
    }
  }

  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
    } else {
      @Suppress("DEPRECATION")
      window.addFlags(
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
      )
    }

    // Keep screen on
    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

    window.setGravity(Gravity.TOP)
    window.attributes = window.attributes.apply {
      width = WindowManager.LayoutParams.MATCH_PARENT
      height = WindowManager.LayoutParams.MATCH_PARENT
    }
    setFinishOnTouchOutside(false)

    val payload = readPayload(intent) ?: run {
      finish()
      return
    }

    val container = FrameLayout(this).apply {
      setBackgroundColor(Color.parseColor("#80000000")) // Semi-transparent black background
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT,
      )
      setPadding(24, 120, 24, 120)
    }

    val contentLayout = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER_HORIZONTAL
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.WRAP_CONTENT,
      ).apply {
        gravity = Gravity.CENTER
      }
    }

    val card = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      background = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = 36f
        setColor(Color.parseColor("#FBF7F0"))
        setStroke(2, Color.parseColor("#D7CCBD"))
      }
      elevation = 16f
      setPadding(48, 48, 48, 48)
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      )
    }

    card.addView(labelView(if (payload.spam) "Potential spam" else "Incoming caller", 14f, "#A35F35", true))
    card.addView(spacer(12))
    card.addView(labelView(payload.name, 32f, "#201B17", true))
    card.addView(spacer(8))
    card.addView(labelView(payload.phoneNumber, 16f, "#6F665C", false))
    card.addView(spacer(4))
    card.addView(labelView(payload.location, 16f, "#6F665C", false))
    card.addView(spacer(24))
    card.addView(metaRow(payload))

    contentLayout.addView(card)
    contentLayout.addView(spacer(64))

    val buttonRow = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      )
    }

    val declineBtn = createButton("Decline", "#FFEAEA", "#D32F2F") {
      declineCall()
    }
    
    val answerBtn = createButton("Answer", "#E8F5E9", "#2E7D32") {
      answerCall()
    }

    buttonRow.addView(declineBtn)
    buttonRow.addView(spacerWidth(32))
    buttonRow.addView(answerBtn)

    contentLayout.addView(buttonRow)
    contentLayout.addView(spacer(48))

    val closeBtn = createButton("Dismiss Overlay", "#404040", "#FFFFFF") {
      finish()
    }
    contentLayout.addView(closeBtn)

    container.addView(contentLayout)
    setContentView(container)

    // Register receiver to auto-close when phone stops ringing
    val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      registerReceiver(callStateReceiver, filter, Context.RECEIVER_EXPORTED)
    } else {
      registerReceiver(callStateReceiver, filter)
    }
  }

  override fun onDestroy() {
    super.onDestroy()
    try {
      unregisterReceiver(callStateReceiver)
    } catch (e: Exception) {
      // Ignored
    }
  }

  @SuppressLint("MissingPermission")
  private fun answerCall() {
    try {
      val telecomManager = getSystemService(Context.TELECOM_SERVICE) as TelecomManager
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        telecomManager.acceptRingingCall()
      }
      finish()
    } catch (e: Exception) {
      e.printStackTrace()
      finish()
    }
  }

  @SuppressLint("MissingPermission")
  private fun declineCall() {
    try {
      val telecomManager = getSystemService(Context.TELECOM_SERVICE) as TelecomManager
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        telecomManager.endCall()
      }
      finish()
    } catch (e: Exception) {
      e.printStackTrace()
      finish()
    }
  }

  private fun createButton(text: String, bgColor: String, textColor: String, onClick: () -> Unit): TextView {
    return TextView(this).apply {
      this.text = text
      textSize = 16f
      setTypeface(typeface, Typeface.BOLD)
      setTextColor(Color.parseColor(textColor))
      gravity = Gravity.CENTER
      background = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = 100f
        setColor(Color.parseColor(bgColor))
      }
      setPadding(64, 32, 64, 32)
      setOnClickListener { onClick() }
    }
  }

  private fun metaRow(payload: CallerOverlayPayload): LinearLayout {
    return LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
      addView(statusPill(if (payload.spam) "Spam risk ${payload.spamScore}" else "Confidence ${payload.confidence}%"))
      addView(TextView(this@CallerOverlayActivity).apply {
        text = if (payload.spam) "Avoid answering blindly." else "Identity matched before answer."
        setTextColor(Color.parseColor("#201B17"))
        textSize = 13f
        layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f).apply {
          marginStart = 18
        }
      })
    }
  }

  private fun statusPill(text: String): TextView {
    return TextView(this).apply {
      this.text = text
      setTextColor(Color.parseColor("#201B17"))
      textSize = 12f
      setTypeface(typeface, Typeface.BOLD)
      background = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = 999f
        setColor(Color.parseColor("#EFE5D6"))
      }
      setPadding(24, 12, 24, 12)
    }
  }

  private fun labelView(text: String, size: Float, color: String, bold: Boolean): TextView {
    return TextView(this).apply {
      this.text = text
      textSize = size
      setTextColor(Color.parseColor(color))
      if (bold) {
        setTypeface(typeface, Typeface.BOLD)
      }
      gravity = Gravity.CENTER_HORIZONTAL
    }
  }

  private fun spacer(height: Int): TextView {
    return TextView(this).apply {
      layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, height)
    }
  }

  private fun spacerWidth(width: Int): TextView {
    return TextView(this).apply {
      layoutParams = LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.MATCH_PARENT)
    }
  }

  private fun readPayload(intent: Intent): CallerOverlayPayload? {
    val phoneNumber = intent.getStringExtra(EXTRA_PHONE_NUMBER) ?: return null
    val name = intent.getStringExtra(EXTRA_NAME) ?: return null
    val location = intent.getStringExtra(EXTRA_LOCATION) ?: "Nigeria"
    return CallerOverlayPayload(
      phoneNumber = phoneNumber,
      name = name,
      location = location,
      spam = intent.getBooleanExtra(EXTRA_SPAM, false),
      confidence = intent.getIntExtra(EXTRA_CONFIDENCE, 0),
      spamScore = intent.getIntExtra(EXTRA_SPAM_SCORE, 0),
    )
  }

  companion object {
    private const val EXTRA_PHONE_NUMBER = "extra_phone_number"
    private const val EXTRA_NAME = "extra_name"
    private const val EXTRA_LOCATION = "extra_location"
    private const val EXTRA_SPAM = "extra_spam"
    private const val EXTRA_CONFIDENCE = "extra_confidence"
    private const val EXTRA_SPAM_SCORE = "extra_spam_score"

    fun launch(context: Context, payload: CallerOverlayPayload) {
      val intent = Intent(context, CallerOverlayActivity::class.java).apply {
        addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
            Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS or
            Intent.FLAG_ACTIVITY_NO_ANIMATION,
        )
        putExtra(EXTRA_PHONE_NUMBER, payload.phoneNumber)
        putExtra(EXTRA_NAME, payload.name)
        putExtra(EXTRA_LOCATION, payload.location)
        putExtra(EXTRA_SPAM, payload.spam)
        putExtra(EXTRA_CONFIDENCE, payload.confidence)
        putExtra(EXTRA_SPAM_SCORE, payload.spamScore)
      }
      context.startActivity(intent)
    }
  }
}
