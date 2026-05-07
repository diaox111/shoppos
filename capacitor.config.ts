import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shoppos.app',
  appName: '商店收银',
  webDir: 'out',
  server: {
    androidScheme: 'http',
  },
};

export default config;
