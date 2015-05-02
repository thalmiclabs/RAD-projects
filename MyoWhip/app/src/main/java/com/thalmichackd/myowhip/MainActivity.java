package com.thalmichackd.myowhip;

import android.content.Intent;
import android.graphics.Color;
import android.media.MediaPlayer;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.Toast;

import com.thalmic.myo.AbstractDeviceListener;
import com.thalmic.myo.Arm;
import com.thalmic.myo.DeviceListener;
import com.thalmic.myo.Hub;
import com.thalmic.myo.Myo;
import com.thalmic.myo.Vector3;
import com.thalmic.myo.scanner.ScanActivity;


public class MainActivity extends ActionBarActivity {
    private Toast mToast;
    private Vector3 lastGyro;
    private long cooldownTimestamp;
    private MediaPlayer whipCrack;

    private DeviceListener mListener = new AbstractDeviceListener() {
        @Override
        public void onConnect(Myo myo, long timestamp) {
            showToast(myo.getName() + " Connected ");
        }
        @Override
        public void onDisconnect(Myo myo, long timestamp) {
            showToast(myo.getName() + " Disconnected");
        }

        @Override
        public void onGyroscopeData (Myo myo, long timestamp, Vector3 gyro){
            double val = Math.abs(gyro.x() - lastGyro.x());

            if(val > 400 && timestamp > cooldownTimestamp){
                showToast("WHIP IT GOOD!");
                cooldownTimestamp = timestamp + 1200;
                whipCrack.start();
            }
            lastGyro = gyro;
        }
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        cooldownTimestamp = 0;
        lastGyro = new Vector3();
        whipCrack = MediaPlayer.create(this, R.raw.whip_crack);

        Hub hub = Hub.getInstance();
        if (!hub.init(this, getPackageName())) {
            // We can't do anything with the Myo device if the Hub can't be initialized, so exit.
            Toast.makeText(this, "Couldn't initialize Hub", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
       // hub.addListener(mListener);
    }

    @Override
    protected void onResume(){
        super.onResume();
        Hub hub = Hub.getInstance();
        hub.addListener(mListener);
    }

    @Override
    protected void onPause(){
        super.onPause();
        Hub hub = Hub.getInstance();
        hub.removeListener(mListener);
    }



    private void showToast(String text) {
        if (mToast == null) {
            mToast = Toast.makeText(this, text, Toast.LENGTH_SHORT);
        } else {
            mToast.setText(text);
        }
        mToast.show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Hub.getInstance().removeListener(mListener);
        if (isFinishing()) {
            Hub.getInstance().shutdown();
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main, menu);
        return true;
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (R.id.action_scan == id) {
            onScanActionSelected();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    private void onScanActionSelected() {
        Intent intent = new Intent(this, ScanActivity.class);
        startActivity(intent);
    }
}
