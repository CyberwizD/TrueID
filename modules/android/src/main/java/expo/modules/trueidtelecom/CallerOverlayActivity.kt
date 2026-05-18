package expo.modules.trueidtelecom

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView

class CallerOverlayActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
    } else {
      @Suppress("DEPRECATION")
      window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED)
    }

    window.setGravity(Gravity.TOP)
    window.attributes = window.attributes.apply {
      width = WindowManager.LayoutParams.MATCH_PARENT
      height = WindowManager.LayoutParams.WRAP_CONTENT
      y = 36
    }
    setFinishOnTouchOutside(true)

    val payload = readPayload(intent) ?: run {
      finish()
      return
    }

    val container = FrameLayout(this).apply {
      setBackgroundColor(Color.TRANSPARENT)
      layoutParams = FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.WRAP_CONTENT,
      )
      setPadding(24, 40, 24, 0)
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
      setPadding(36, 32, 36, 28)
    }

    card.addView(labelView(if (payload.spam) "Potential spam" else "Incoming caller", 12f, "#A35F35", true))
    card.addView(spacer(8))
    card.addView(labelView(payload.name, 26f, "#201B17", true))
    card.addView(spacer(6))
    card.addView(labelView(payload.phoneNumber, 14f, "#6F665C", false))
    card.addView(spacer(4))
    card.addView(labelView(payload.location, 14f, "#6F665C", false))
    card.addView(spacer(18))
    card.addView(metaRow(payload))

    container.addView(card)
    setContentView(container)

    Handler(Looper.getMainLooper()).postDelayed({ finish() }, 6500)
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
    }
  }

  private fun spacer(height: Int): TextView {
    return TextView(this).apply {
      layoutParams = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        height,
      )
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
