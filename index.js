const express = require("express");
const app = express();
const PORT = process.env.PORT || 3616;


app.listen(PORT,function () {
    console.log("server is running......");
});

app.use(express.static("public"));
app.set("view engine", "ejs");

const mssql = require("mssql");
const config = {
    server: '101.99.13.2',
    user: 'sa',
    password: 'z@GH7ytQ',
    database: 'test'
};

mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("keets noois thanhf coong");
});

const db = new mssql.Request();

app.get("/", function (req,res) {
    let sql_text = "SELECT TOP 8 T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID ORDER BY T2005E_NoName_SanPham.ID ASC;" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT TOP 4 T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID ORDER BY T2005E_NoName_SanPham.ID DESC;" +
        "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT TOP 3 T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID ORDER BY T2005E_NoName_SanPham.ID ASC;";
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        else res.render("home",{
            nhathietkes: rows.recordsets[1],
            sanphams: rows.recordsets[0],
            featureds:rows.recordsets[2],
            danhmucs: rows.recordsets[3],
            sanpham_blogs: rows.recordsets[4]
        });
    })
});

app.get("/category/:id",async function (req,res) {
    const DanhMucID = req.params.id;
    const sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID WHERE T2005E_NoName_SanPham.ID_DanhMuc = "+DanhMucID+";" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_DanhMuc) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_DanhMuc;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_NhaThietKe) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_NhaThietKe;";
    let data = {
        danhmucs:[],
        sanphams: [],
        nhathietkes: [],
        danhMucHienTai: {},
        coutdanhmucs: [],
        coutnhathietkes: []
    };
    await db.query(sql_text).then(rows=>{
        const danhmucs = rows.recordsets[0];
        for(let d of danhmucs){
            if(d.ID == DanhMucID){
                data.danhMucHienTai = d;
                break;
            }
        }
        data.danhmucs = danhmucs;
        data.sanphams = rows.recordsets[1];
        data.nhathietkes = rows.recordsets[2];
        data.coutdanhmucs = rows.recordsets[3];
        data.nhathietkes = rows.recordsets[4];
    }).catch(err=>{
        console.log(err);
    })
    res.render("category",data);
});

app.get("/designer/:id",async function (req,res) {
    const NhaThietKeID = req.params.id;
    const sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID WHERE T2005E_NoName_SanPham.ID_NhaThietKe = "+NhaThietKeID+";" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_DanhMuc) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_DanhMuc;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_NhaThietKe) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_NhaThietKe;";
    let data = {
        danhmucs:[],
        sanphams: [],
        nhathietkes: [],
        nhaThietKeHienTai: {},
        coutdanhmucs: [],
        coutnhathietkes: []
    };
    await db.query(sql_text).then(rows=>{
        const nhathietkes = rows.recordsets[2];
        for(let d of nhathietkes){
            if(d.ID == NhaThietKeID){
                data.nhaThietKeHienTai = d;
                break;
            }
        }
        data.nhathietkes = nhathietkes;
        data.danhmucs = rows.recordsets[0];
        data.sanphams = rows.recordsets[1];
        data.coutdanhmucs = rows.recordsets[3];
        data.coutnhathietkes = rows.recordsets[4];
    }).catch(err=>{
        console.log(err);
    })
    res.render("designer",data);
});

app.get("/shop",async function (req,res) {
    const sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID;" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_DanhMuc) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_DanhMuc;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_NhaThietKe) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_NhaThietKe;";
    let data = {
        danhmucs:[],
        sanphams: [],
        nhathietkes: [],
        coutdanhmucs: [],
        coutnhathietkes: []
    };
    await db.query(sql_text).then(rows=>{
        data.nhathietkes = rows.recordsets[2];
        data.danhmucs = rows.recordsets[0];
        data.sanphams = rows.recordsets[1];
        data.coutdanhmucs = rows.recordsets[3];
        data.coutnhathietkes = rows.recordsets[4];
    }).catch(err=>{
        console.log(err);
    })
    res.render("shop",data);
});

app.get("/product/:id",async function (req,res) {
    const SanPhamID = req.params.id;
    const sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe,T2005E_NoName_DanhMuc.TenDanhMuc FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID INNER JOIN T2005E_NoName_DanhMuc ON T2005E_NoName_SanPham.ID_DanhMuc = T2005E_NoName_DanhMuc.ID WHERE T2005E_NoName_SanPham.ID = "+SanPhamID+";" +
        "SELECT TOP 4 T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID WHERE ID_DanhMuc IN (SELECT ID_DanhMuc FROM T2005E_NoName_SanPham WHERE ID = "+SanPhamID+") or ID_NhaThietKe IN (SELECT ID_NhaThietKe FROM T2005E_NoName_SanPham WHERE ID = "+SanPhamID+");" +
        "SELECT * FROM T2005E_NoName_DanhGiaSanPham WHERE ID_SanPham ="+SanPhamID+";" +
        "SELECT COUNT(ID_SanPham) AS SoluongDanhGia FROM T2005E_NoName_DanhGiaSanPham WHERE ID_SanPham ="+SanPhamID;
    let data = {
        danhmucs: [],
        sanpham: {},
        nhathietkes: [],
        sanphamlienquans: [],
        danhgiasanphams:[],
        soluongdanhgia: {}
    };
    try{
        const rows = await db.query(sql_text)
        data.danhmucs = rows.recordsets[0];
        data.nhathietkes = rows.recordsets[1];
        data.sanpham = rows.recordsets[2].length>0?rows.recordsets[2][0]:{};
        data.sanphamlienquans = rows.recordsets[3];
        data.danhgiasanphams = rows.recordsets[4];
        data.soluongdanhgia = rows.recordsets[5].length>0?rows.recordsets[5][0]:{};
    }catch (err) {
        console.log(err);
    }
    res.render("product",data);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.post("/luudanhgia",async function (req,res) {
    //npm i body-parser
    const tenKH = req.body.fullname;
    const nhanXet = req.body.nhanxet;
    const soSao = req.body.star;
    const idsanpham = req.body.idsanpham;
    const eMail = req.body.email;
    var sql_text = "INSERT INTO T2005E_NoName_DanhGiaSanPham (NhanXet, SoSao, ID_SanPham, TenNguoiDanhGia, Email) "+
        `VALUES (N'${nhanXet}', ${soSao}, ${idsanpham}, N'${tenKH}', '${eMail}');`;
    try{
        await db.query(sql_text);
    }catch (err) {
        console.log(err);
    }
    res.redirect(`/product/${idsanpham}`);
});

app.get("/cart/:id",async function (req,res) {
    const SanPhamID = req.params.id;
    const sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT * FROM T2005E_NoName_SanPham WHERE ID = "+SanPhamID;
    let data = {
        danhmucs: [],
        nhathietkes: [],
        sanpham: {},
    };
    try{
        const rows = await db.query(sql_text)
        data.danhmucs = rows.recordsets[0];
        data.nhathietkes = rows.recordsets[1];
        data.sanpham = rows.recordsets[2].length>0?rows.recordsets[2][0]:{};
    }catch (err) {
        console.log(err);
    }
    res.render("cart",data);
});

app.get("/timkiem",async function (req,res) {
    let keyword = req.query.search;
    let min = req.query.min;
    let max = req.query.max;
    let sql_text = "SELECT * FROM T2005E_NoName_DanhMuc;" +
        "SELECT * FROM T2005E_NoName_NhaThietKe;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_DanhMuc) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_DanhMuc;" +
        "SELECT COUNT(T2005E_NoName_SanPham.ID_NhaThietKe) AS SoLuong FROM T2005E_NoName_SanPham group by T2005E_NoName_SanPham.ID_NhaThietKe;" +
        "SELECT a.* FROM T2005E_NoName_SanPham as a " +
        "INNER JOIN T2005E_NoName_DanhMuc as b ON b.ID = a.ID_DanhMuc " +
        "INNER JOIN T2005E_NoName_NhaThietKe as c ON c.ID = a.ID_NhaThietKe " +
        "WHERE a.TenSP LIKE N'%"+keyword+"%' "+
        "OR b.TenDanhMuc LIKE N'%"+keyword+"%' "+
        "OR c.TenNhaThietKe LIKE N'%"+keyword+"%'; ";
        "SELECT T2005E_NoName_SanPham.*,T2005E_NoName_NhaThietKe.TenNhaThietKe FROM T2005E_NoName_SanPham INNER JOIN T2005E_NoName_NhaThietKe ON T2005E_NoName_SanPham.ID_NhaThietKe = T2005E_NoName_NhaThietKe.ID WHERE GiaSP BETWEEN "+min+" AND "+max+";";
    let data = {
        danhmucs:[],
        sanphams: [],
        nhathietkes: [],
        coutdanhmucs: [],
        coutnhathietkes: [],
        // keyword:keyword,
        // min:min,
        // max:max
    }
    try{
        const rows = await db.query(sql_text);
        data.nhathietkes = rows.recordsets[1];
        data.danhmucs = rows.recordsets[0];
        data.sanphams = rows.recordsets[4];
        data.coutdanhmucs = rows.recordsets[2];
        data.coutnhathietkes = rows.recordsets[3];
    }catch (err) {
        console.log(err.message);
    }
    res.render("search",data);
})