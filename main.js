const express = require("express")
const app = express()
const formidableMiddleware = require('express-formidable')
const fs = require('fs')
const html_specialchars = require('html-specialchars')
const mysql = require('mysql')
const expressip = require("express-ip")
const generator = require('generate-password')
var Sync = require('sync')
    //MYSQL
const connection = mysql.createConnection({
    host: 'VERI TABANI BAĞLANTI ADRESİ',
    user: 'VERI TABANI KULLANICI ADI',
    password: 'VERI TABANI PAROLA',
    database: 'VERITABANI KULLANILACAK VERITABANI',
    //ssl: {
    //    ca: fs.readFileSync("ŞİFRELEME KULLANILIYORSA ANAHTAR DOSYASININ YOLU") //Eğer veritabanınız bağlantı esnasında şifreleme kullanıyorsa buradaki yorum satırlarını silin
    //}
})
connection.connect(function(err) {
        if (err) throw err
        console.log("Veritabanı kontrolü tamamlandı\nSonuç : Çalışıyor!")

    })
    //EXPRESS JS
app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: __dirname + "/views/user_files/",
    multiples: false
}))
app.use(expressip().getIpInfoMiddleware)
app.get("/", (req, res) => {
    res.render('index.ejs', {
        SEO_Baslik: "Yüklüy.ooo",
        SEO_Aciklama: "Türkiyenin en modern, basit ve hızlı dosya depolama servisi.",
        SEO_Anahtar_Kelimeler: "dosya,depolama,yüklüyooo,upload",
        SEO_Yaratici: "GreXLin85",
        SITE_Baslik: "YÜKLÜY.OOO"
    })
})

app.get("/gizlilik", (req, res) => {
    res.render('gizlilik.ejs')
})

app.get("/indiriyooo/:uniqlink", (req, res) => {



        connection.query("SELECT * FROM uploads WHERE uniqlink = '" + req.params.uniqlink + "'", function(err, result) {

            if (result[0] == undefined) {
                res.render("404.ejs", {
                    SEO_Baslik: "Yüklüy.ooo",
                    SEO_Aciklama: "Türkiyenin en modern, basit ve hızlı dosya depolama servisi.",
                    SEO_Anahtar_Kelimeler: "dosya,depolama,yüklüyooo",
                    SEO_Yaratici: "GreXLin85",
                    SITE_Baslik: "404lüy.OOO"
                })
            } else {
                res.render("indiriyoo.ejs", {
                    SEO_Baslik: "Yüklüy.ooo",
                    SEO_Aciklama: "Türkiyenin en modern, basit ve hızlı dosya depolama servisi.",
                    SEO_Anahtar_Kelimeler: "dosya,depolama,yüklüyooo",
                    SEO_Yaratici: "GreXLin85",
                    SITE_Baslik: "YÜKLÜY.OOO",
                    DOSYA_ad: result[0].dosya_ad,
                    DOSYA_boyut: result[0].boyut,
                    DOSYA_uniqid: req.params.uniqlink

                })
            }
        })
    })
    //API
app.post('/api/upload', (req, res) => {

    const uniqid = generator.generate({
        length: 5,
        numbers: true
    });

    req.files.resume.name = html_specialchars.escape(req.files.resume.name)
    req.files.resume.name = req.files.resume.name.toString().substr(0, 100)
    var sql = "INSERT INTO uploads (dosya_yol, dosya_ad,boyut,uniqlink,yukleyenip) VALUES ?";
    var values = [
        [req.files.resume.path, req.files.resume.name, req.files.resume.size, uniqid, req.ipInfo]
    ]

    connection.query(sql, [values], function(err, result) {
        if (err) throw err;
        console.log("Yeni bir kayıt eklendi : " + req.files.resume.name + "(" + uniqid + ")")
    })

    res.redirect("/indiriyooo/" + uniqid)
})
app.get('/api/download/:uniqlink', (req, res) => {

        connection.query("SELECT * FROM uploads WHERE uniqlink = '" + req.params.uniqlink + "'", function(err, result) {
            if (err) throw err;
            var files = fs.createReadStream(result[0].dosya_yol);
            res.writeHead(200, { 'Content-disposition': 'attachment; filename=' + result[0].dosya_ad });
            files.pipe(res)

        })
    })
    //SERVER
app.listen(80, () => {
    console.log('Sunucu 80 portu üzerinde aktif!')
})