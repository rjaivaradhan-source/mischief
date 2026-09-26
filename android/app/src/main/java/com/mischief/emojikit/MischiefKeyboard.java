package com.mischief.emojikit;

import android.content.*;
import android.inputmethodservice.InputMethodService;
import android.net.Uri;
import android.text.InputType;
import android.view.View;
import android.view.inputmethod.*;
import android.widget.*;

public final class MischiefKeyboard extends InputMethodService implements MixerView.Host {
    private MixerView mixer;
    private boolean restricted;
    @Override public View onCreateInputView(){
        if(mixer!=null)mixer.destroy();
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(0xfff8f9f4);
        LinearLayout toolbar=new LinearLayout(this);
        Button back=new Button(this);back.setText("ABC / Switch");back.setOnClickListener(v->((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).showInputMethodPicker());toolbar.addView(back,new LinearLayout.LayoutParams(0,-2,1));
        Button open=new Button(this);open.setText("Open mixer");open.setOnClickListener(v->startActivity(new Intent(this,MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)));toolbar.addView(open,new LinearLayout.LayoutParams(0,-2,1));
        root.addView(toolbar);mixer=new MixerView(this,this,true);
        int height=Math.min(Math.round(360*getResources().getDisplayMetrics().density),Math.round(getResources().getDisplayMetrics().heightPixels*.42f));
        root.addView(mixer,new LinearLayout.LayoutParams(-1,height));return root;
    }
    @Override public boolean onEvaluateFullscreenMode(){return false;}
    @Override public void onStartInputView(EditorInfo info,boolean restarting){
        super.onStartInputView(info,restarting);int variation=info.inputType&InputType.TYPE_MASK_VARIATION;int kind=info.inputType&InputType.TYPE_MASK_CLASS;
        restricted=(kind==InputType.TYPE_CLASS_NUMBER&&variation==InputType.TYPE_NUMBER_VARIATION_PASSWORD)||(kind==InputType.TYPE_CLASS_TEXT&&(variation==InputType.TYPE_TEXT_VARIATION_PASSWORD||variation==InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD||variation==InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD));
        if(mixer!=null){mixer.invalidateExport();mixer.onResume();mixer.message(restricted?"Switch to your regular keyboard for this field.":accepts("image/png")||accepts("image/gif")?"This field supports stickers. Choose PNG or GIF.":"This field accepts text only. Use original emojis, or copy a sticker.");}
    }
    private boolean accepts(String mime){EditorInfo info=getCurrentInputEditorInfo();if(info==null||info.contentMimeTypes==null)return false;for(String type:info.contentMimeTypes)if(ClipDescription.compareMimeTypes(mime,type))return true;return false;}
    @Override public void image(String data,String mime,String alt,boolean copy){
        if(restricted){mixer.message("Switch to your regular keyboard for this field.");return;}
        try{
            if(!copy&&!accepts(mime)){mixer.message("This app does not accept "+(mime.equals("image/gif")?"GIF":"PNG")+" here. Try the other format, Copy PNG, or original emojis.");return;}
            Uri uri=StickerProvider.save(this,data,mime);
            if(copy){((ClipboardManager)getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newUri(getContentResolver(),alt,uri));mixer.message("Sticker copied. Image paste depends on the receiving app.");return;}
            InputConnection connection=getCurrentInputConnection();
            boolean accepted=connection!=null&&connection.commitContent(new InputContentInfo(uri,new ClipDescription(alt,new String[]{mime}),null),InputConnection.INPUT_CONTENT_GRANT_READ_URI_PERMISSION,null);
            mixer.message(accepted?"Sticker handed to the app. Review it before sending.":"The app declined the sticker. Try Copy PNG or original emojis.");
        }catch(Exception e){mixer.message("Could not insert sticker. Try Copy PNG or original emojis.");}
    }
    @Override public void text(String text){if(restricted)return;InputConnection connection=getCurrentInputConnection();if(connection!=null)connection.commitText(text,1);}
    @Override public void onFinishInputView(boolean finishing){if(mixer!=null){mixer.invalidateExport();mixer.onPause();}super.onFinishInputView(finishing);}
    @Override public void onDestroy(){if(mixer!=null)mixer.destroy();super.onDestroy();}
}
