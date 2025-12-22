
# 🚀 Nexus Remote Controller

Bu uygulama, telefonunuzu bir uzaktan kumandaya dönüştürerek bilgisayarınızı kontrol etmenizi sağlar. Gemini AI desteği ile özel komutlar (makrolar) oluşturabilirsiniz.

## 🛠️ Kurulum Adımları

### 1. Telefon Uygulaması (Frontend)
1. GitHub'da bu repoyu oluşturun.
2. `Settings > Secrets and variables > Actions` kısmına gidin.
3. `New repository secret` butonuna basın:
   - Name: `API_KEY`
   - Value: (Gemini API anahtarınız)
4. Kodunuzu `main` branchine pushladığınızda uygulama otomatik olarak yayınlanacaktır.
5. `Settings > Pages` kısmından linkinizi görebilirsiniz.

### 2. Bilgisayar Ajanı (PC Agent)
Bilgisayarınızda komutları çalıştıracak olan Python sunucusunu kurun:

1. `nexus_agent.py` dosyasını indirin.
2. Gerekli kütüphaneleri yükleyin:
   ```bash
   pip install flask flask-cors
   ```
3. Sunucuyu başlatın:
   ```bash
   python nexus_agent.py
   ```

## 📱 Kullanım
- Uygulamayı telefonunuzda açın ve "Ana Ekrana Ekle" diyerek yükleyin.
- Ayarlar ikonuna tıklayarak bilgisayarınızın Yerel IP adresini girin.
- Sol üstteki bağlantı ışığı yeşil yandığında hazırsınız!

## 🤖 AI Özellikleri
Düzenleme modunda bir butona tıklayıp AI kısmına şu tarz komutlar yazabilirsiniz:
- "Chrome'u aç ve netflix.com'a git"
- "Steam'i başlat ve kütüphaneyi aç"
- "Bilgisayarı 1 saat sonra kapat"
