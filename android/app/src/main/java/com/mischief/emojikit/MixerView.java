package com.mischief.emojikit;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.webkit.*;
import java.io.*;
import org.json.JSONObject;

/** Only bundled, offline content is allowed to reach the native bridge. */
final class MixerView extends WebView {
    interface Host {void image(String data,String mime,String alt,boolean copy);void text(String text);}
    private final Host host;
    private String status="Mix 2–4 emojis.";
    private volatile int generation=0;
    @SuppressLint({"SetJavaScriptEnabled","AddJavascriptInterface"})
    MixerView(Context context,Host host,boolean keyboard){
        super(context);this.host=host;setBackgroundColor(0xfff8f9f4);
        getSettings().setJavaScriptEnabled(true);getSettings().setDomStorageEnabled(false);
        getSettings().setAllowFileAccess(false);getSettings().setAllowContentAccess(false);
        getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        addJavascriptInterface(new Bridge(),"Android");
        setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return true;}
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();String name=uri.getPath();
                if(!"https".equals(uri.getScheme())||!"mischief.local".equals(uri.getHost())||name==null||!name.startsWith("/assets/")||name.contains(".."))return blocked();
                name=name.substring(8);
                String mime=name.endsWith(".html")?"text/html":name.endsWith(".js")||name.endsWith(".mjs")?"text/javascript":name.endsWith(".css")?"text/css":name.endsWith(".svg")?"image/svg+xml":"text/plain";
                try{return new WebResourceResponse(mime,"UTF-8",getContext().getAssets().open(name));}catch(IOException e){return blocked();}
            }
            @Override public void onPageFinished(WebView v,String url){message(status);}
        });
        loadUrl("https://mischief.local/assets/keyboard.html?mode="+(keyboard?"keyboard":"app"));
    }
    private static WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0]));}
    void message(String message){status=message;evaluateJavascript("window.nativeStatus&&window.nativeStatus("+JSONObject.quote(message)+")",null);}
    void invalidateExport(){generation++;evaluateJavascript("window.cancelExport&&window.cancelExport()",null);}
    private class Bridge {
        @JavascriptInterface public int token(){return generation;}
        @JavascriptInterface public void send(String data,String mime,String alt,int token){dispatch(data,mime,alt,false,token);}
        @JavascriptInterface public void copy(String data,String mime,String alt,int token){dispatch(data,mime,alt,true,token);}
        private void dispatch(String data,String mime,String alt,boolean copy,int token){if(data!=null&&mime!=null&&alt!=null&&data.length()<=12_000_000&&alt.length()<=500)post(()->{if(token==generation)host.image(data,mime,alt,copy);});}
        @JavascriptInterface public void text(String text){if(text!=null&&text.length()<=200)post(()->host.text(text));}
    }
}
