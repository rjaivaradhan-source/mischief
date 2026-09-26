package com.mischief.emojikit;

import android.app.Activity;
import android.content.*;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.*;

public final class MainActivity extends Activity implements MixerView.Host {
    private MixerView mixer;
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(0xfff8f9f4);
        root.setOnApplyWindowInsetsListener((view,insets)->{view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
        TextView title=new TextView(this);title.setText("Mischief · Emoji Keyboard");title.setTextSize(22);title.setPadding(20,16,20,8);root.addView(title);
        LinearLayout setup=new LinearLayout(this);
        Button enable=new Button(this);enable.setText("1. Enable keyboard");enable.setOnClickListener(v->startActivity(new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)));setup.addView(enable,new LinearLayout.LayoutParams(0,-2,1));
        Button choose=new Button(this);choose.setText("2. Choose keyboard");choose.setOnClickListener(v->((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).showInputMethodPicker());setup.addView(choose,new LinearLayout.LayoutParams(0,-2,1));root.addView(setup);
        mixer=new MixerView(this,this,false);root.addView(mixer,new LinearLayout.LayoutParams(-1,0,1));setContentView(root);root.requestApplyInsets();
    }
    @Override public void image(String data,String mime,String alt,boolean copy){
        try{Uri uri=StickerProvider.save(this,data,mime);
            if(copy){((ClipboardManager)getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newUri(getContentResolver(),"Mischief sticker",uri));mixer.message("Sticker copied. Paste in an app that accepts images.");}
            else{Intent send=new Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM,uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);send.setClipData(ClipData.newUri(getContentResolver(),alt,uri));startActivity(Intent.createChooser(send,"Share Mischief sticker"));}
        }catch(Exception e){mixer.message("Could not share this sticker. Try PNG or copy the emojis.");}
    }
    @Override public void text(String text){((ClipboardManager)getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("Emojis",text));mixer.message("Original emojis copied.");}
    @Override protected void onPause(){super.onPause();if(mixer!=null)mixer.onPause();}
    @Override protected void onResume(){super.onResume();if(mixer!=null)mixer.onResume();}
    @Override protected void onDestroy(){if(mixer!=null)mixer.destroy();super.onDestroy();}
}
