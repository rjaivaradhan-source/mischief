package com.mischief.emojikit;

import android.content.*;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import android.util.Base64;
import java.io.*;
import java.util.UUID;

/** Read-only, temporary content URIs. Android grants access only to chosen recipients. */
public final class StickerProvider extends ContentProvider {
    static final String AUTHORITY="com.mischief.emojikit.stickers";
    static Uri save(Context context,String data,String mime) throws IOException {
        if (!(mime.equals("image/png")||mime.equals("image/gif"))||data.length()>12_000_000) throw new IOException("Invalid sticker");
        byte[] bytes;
        try { bytes=Base64.decode(data,Base64.DEFAULT); } catch(IllegalArgumentException e){throw new IOException("Invalid sticker",e);}
        boolean png=bytes.length>8&&(bytes[0]&255)==137&&bytes[1]==80&&bytes[2]==78&&bytes[3]==71;
        boolean gif=bytes.length>6&&bytes[0]==71&&bytes[1]==73&&bytes[2]==70;
        if ((mime.equals("image/png")&&!png)||(mime.equals("image/gif")&&!gif))throw new IOException("Invalid image");
        File dir=new File(context.getCacheDir(),"stickers");if(!dir.exists()&&!dir.mkdirs())throw new IOException("Storage unavailable");
        File[] old=dir.listFiles();if(old!=null)for(File file:old)if(System.currentTimeMillis()-file.lastModified()>7L*86400000)file.delete();
        String name=UUID.randomUUID()+(png?".png":".gif");
        try(FileOutputStream out=new FileOutputStream(new File(dir,name))){out.write(bytes);}
        return new Uri.Builder().scheme("content").authority(AUTHORITY).appendPath(name).build();
    }
    private File file(Uri uri)throws FileNotFoundException {
        String name=uri.getLastPathSegment();
        if(!AUTHORITY.equals(uri.getAuthority())||uri.getPathSegments().size()!=1||name==null||!name.matches("[a-f0-9-]{36}\\.(png|gif)"))throw new FileNotFoundException();
        File file=new File(new File(getContext().getCacheDir(),"stickers"),name);if(!file.isFile())throw new FileNotFoundException();return file;
    }
    @Override public boolean onCreate(){return true;}
    @Override public String getType(Uri uri){return uri.toString().endsWith(".gif")?"image/gif":"image/png";}
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException {if(!"r".equals(mode))throw new FileNotFoundException("Read only");return ParcelFileDescriptor.open(file(uri),ParcelFileDescriptor.MODE_READ_ONLY);}
    @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String order){
        try{File f=file(uri);String[] columns=projection!=null?projection:new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE};MatrixCursor c=new MatrixCursor(columns);Object[] row=new Object[columns.length];for(int i=0;i<columns.length;i++)row[i]=columns[i].equals(OpenableColumns.DISPLAY_NAME)?f.getName():columns[i].equals(OpenableColumns.SIZE)?f.length():null;c.addRow(row);return c;}catch(FileNotFoundException e){return null;}
    }
    @Override public Uri insert(Uri u,ContentValues v){throw new UnsupportedOperationException();}
    @Override public int update(Uri u,ContentValues v,String s,String[] a){throw new UnsupportedOperationException();}
    @Override public int delete(Uri u,String s,String[] a){throw new UnsupportedOperationException();}
}
