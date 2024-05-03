var express = require("express")
var router =  express.Router()
var passport = require("../config/passport")
var xulydb = require("../CRUD/xulydb")
var moment = require('moment')
// const toolmongo = require("../tool_mongo/backup")
// const sendmail = require('../sendmail/sendmail')
const exceljs = require('exceljs');
const fs = require('fs')
const { header } = require("express-validator")

//sendmail.sendmail()

// router.get('/cronjobsendmail',async(req, res) => {
//     var data =  await xulydb.doc_createthietbi()
//     var newdata = await tinhngayconlai(data)
//     sendmail.sendmail(newdata)
//     res.status(200).send('ok');

// })

router.get("/", (req, res, next) => {
    res.redirect("/signin")
})



router.get("/signin", (req, res , next) => {
    // hien thi trang va truyen lai nhung tin nhan tu phia server neu co
    var messages = req.flash('error')
    res.render("signin",{
        messages: messages,
        hasErrors: messages.length > 0
    })
})
//-------------------TEST------------------------------------

// const originalDate = moment('2020-04-10');
// console.log('Ngày tháng năm ban đầu:', originalDate.format('YYYY-MM-DD'));
// const monthsToAdd = 14;

// const newDate = originalDate.add(monthsToAdd, 'months');


// console.log('Số tháng được cộng thêm:', monthsToAdd);
// console.log('Ngày tháng năm mới:', newDate.format('YYYY-MM-DD'));

// const startDate = moment('2023-01-10');
// const endDate = moment('2023-12-31');

// const daysDifference = endDate.diff(startDate, 'days');

// console.log('Ngày tháng năm bắt đầu:', startDate.format('YYYY-MM-DD'));
// console.log('Ngày tháng năm kết thúc:', endDate.format('YYYY-MM-DD'));
// console.log('Số ngày giữa hai ngày:', daysDifference);

// const daynow = moment().format('YYYY-MM-DD')
// console.log('Ngày hiện tại của local máy tính: ', daynow)

//-------------------TEST------------------------------------

router.post('/xoauser', authenticated, (req, res)=>{
    const result = xulydb.xoaUser(req.body.username)
    if(result){
        res.redirect('/dashboard')
    }else{
        res.send('Loi phia server')
    }
})


async function tinhngayconlai(data){
    var newdata = []
    
    for (let i = 0; i < data.length; i++) {
        let daynow = moment().format('YYYY-MM-DD');
        let songay = moment(data[i].ngayhethan).diff(daynow, 'days');
        //console.log('Data số ngày: ',songay);
        data[i].songayhethan = songay - 1;
        newdata.push(data[i])
       }

    return newdata
}

router.post("/signin",
    passport.authenticate('local.signin', { successRedirect: '/dashboard',
                                  failureRedirect: '/signin',
                                  failureFlash: true })
);

router.post("/signup", 
passport.authenticate('local.signup', { successRedirect: '/signin',
                                  failureRedirect: '/signup',
                                  failureFlash: true })
);

/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error')
   
    res.render('signup',{ 
      messages: messages,
      hasErrors: messages.length > 0,
     })
  });

router.get('/dashboard', authenticated, async(req, res) => {
    // if(req.isAuthenticated()){
    //     if(await xulydb.find(req.user.username)){
            let data = await xulydb.docUser()
        //console.log(data)
            res.render("mainSbAdmin/dashboard",{
            _username: req.user.username,
            data: data,
            activeuser: 'active',
            activetb: '',
            activetbdp2: '',
            })
    //     }else res.redirect("/thietbi")
        
    // }else{
    //     res.redirect("/signin")
    // }
})
// --------------- Du an moi ---------------
router.get('/thietbi', authenticated, async(req, res) => {
    
    
        var data = await xulydb.docTb()
        // console.log(data)
            res.render("mainSbAdmin/dbthietbi",{
            _username: req.user.username,
            data: data,
            activeuser: '',
            activetb: 'active',
            activetbdp2: '',
        })
    

})
// --------------- Du an moi ---------------
router.get("/themthietbi", authenticated, (req, res) => {
    
            res.render("mainSbAdmin/themthietbi",{
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: '',
            activetbdp2: '',
            activethem: '',
            expressFlash: req.flash('success') ,
            expressFlasheror: req.flash('error')
        })
})

// ----- Thêm thiết bị mới ----
router.post("/themtb",  async(req, res) => {
    let doc = {
        Ma: req.body.txtma,
        UGDN: req.body.txtUGDN,
        serial: req.body.txtserial,
        email : req.body.txtemail,
        Mainboard: req.body.txtmain,
        RAM: req.body.txtram,
        CPU: req.body.txtcpu,
        HardDisk: req.body.txthdd,
        Nguoidung : req.body.txtnguoidung,
        Didong: req.body.txtdidong,
        BoPhan : req.body.selectbophan,
        Loai : req.body.selectloai,
        headcount : req.body.selectheadcount,
        noilamviec : req.body.selectnoilamviec,
        ngaymua : req.body.txtngaymua,
        ngayhethan : req.body.txtngayhethan,
        dexuat : req.body.txtdexuat,
        software : req.body.txtsoftware,
        notes : req.body.txtnotes,
        tinhtrang : req.body.selecttinhtrang,
        morong: ''
        
    }
    //console.log(doc)
    const result = await xulydb.themtb(doc)
    if(result){
        req.flash('success', 'Dữ liệu đã lưu thành công !!!.')
        
    }else{
        req.flash('error', 'Lỗi server hoặc nhập ko chính xác !!!.')
    }
    res.redirect("/themthietbi")    
    
})

router
.get('/suathietbi', async (req, res) => {
    let doc = await xulydb.timTb(req.query.id)
    //console.log(doc)
    if(doc){
        res.render('mainSbAdmin/themthietbi_sua', {
            data: doc, 
            _username: ''
        })
    }
})
.post('/updatetb', async (req, res) => {
    let doc = {
        Ma: req.body.txtma,
        UGDN: req.body.txtUGDN,
        serial: req.body.txtserial,
        email : req.body.txtemail,
        Mainboard: req.body.txtmain,
        RAM: req.body.txtram,
        CPU: req.body.txtcpu,
        HardDisk: req.body.txthdd,
        Nguoidung : req.body.txtnguoidung,
        Didong: req.body.txtdidong,
        BoPhan : req.body.selectbophan,
        Loai : req.body.selectloai,
        headcount : req.body.selectheadcount,
        noilamviec : req.body.selectnoilamviec,
        ngaymua : req.body.txtngaymua,
        ngayhethan : req.body.txtngayhethan,
        dexuat : req.body.txtdexuat,
        software : req.body.txtsoftware,
        notes : req.body.txtnotes,
        tinhtrang : req.body.selecttinhtrang,
        morong: ''
        
    }
    let id = req.body.txtmatb
    //console.log(id)
    const result = await xulydb.updatetb(id, doc)
    if(result){
        res.redirect('/suathietbi?id=' + id)
    }else{
        res.send('Lỗi server, ko update được')
    }
    
})

router.post('/xoathietbi', async (req, res)=> {
    let id = req.body.id
    // console.log(id)
    const result = await xulydb.xoathietbi(id)
    if(result){
        res.send('Delete success')
    }else{
        res.send('Unknown Error')
    }
})
// ----- ---------------- ----

router.post('/logout',(req, res) => {
    req.session.destroy()
    res.redirect('/signin')
})

//---------------------------------------------------

router.get('/chart', (req, res) => {
    res.render("mainSbAdmin/main-chart.ejs",{
        user: req.user, //tạm mở user
        
        activeuser: '',
        activetb: '',
        activetbdp2: '',
        activethem: '',
        
    })

})

function authenticated(req, res , next) {
    if(req.isAuthenticated()){
        return next()
    }
    const token = req.headers['authorization']; // Lấy token từ header
  
    if (token) {
      try {
        // Verify token 
        const decoded = jwt.verify(token, secret);  
  
        // Lấy thông tin user từ token
        req.user = decoded.user; 
  
        return next();
  
      } catch (err) {
        // Token không hợp lệ
      }
    }
  
    // Nếu cả Passport và JWT đều không xác thực được
    // thì redirect tới trang đăng nhập
    return res.redirect('/login'); 
}

router.get("/backupmongo",(req, res) => {
    let a = toolmongo.backupMongo("mongodb://127.0.0.1:27017/qlvt", (e, result) => {
        if(e){
            console.error(`Error: ${e.message}`);
            return 'lỗi'
        }else {
            console.log(`Backup and conversion successful. Exported to: ${result}`);
            return 'ok'
        }
    })
    res.send(a)
})

router.get("/restoremongo", (req, res) => {
    let a = toolmongo.restoremongo("mongodb://127.0.0.1:27017/qlvt")
    res.end()
})


router.get('/chuyenexcel', authenticated, async(req, res)=> {
    try {
        // Lấy dữ liệu từ MongoDB
        const documents = await xulydb.docTb();
    
        // Tạo workbook và worksheet của Excel
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Documents');
    
        // Đặt tên các cột
        worksheet.columns = [
          { header: 'Hostname/Mã thiết bị', key: 'Ma', width: 10 },
          { header: 'UGDN', key: 'UGDN', width: 10 },
          { header: 'Email', key: 'email', width: 10 },
          { header: 'Họ & tên', key: 'Nguoidung', width: 10 },
          { header: 'Di động', key: 'Didong', width: 10 },
          { header: 'Headcount', key: 'headcount', width: 10 },
          { header: 'Nơi làm việc', key: 'noilamviec', width: 10 },
          { header: 'Bộ Phận', key: 'BoPhan', width: 10 },
          { header: 'Loại/Type', key: 'Loai', width: 10 },
          { header: 'Mainboard', key: 'Mainboard', width: 10 },
          { header: 'RAM/Bus RAM', key: 'RAM', width: 10 },
          { header: 'CPU', key: 'CPU', width: 10 },
          { header: 'HDD/SSD', key: 'HardDisk', width: 10 },
          { header: 'Serial number', key: 'serial', width: 10 },
          { header: 'Ngày mua', key: 'ngaymua', width: 10 },
          { header: 'Ngày hết hạn', key: 'ngayhethan', width: 10 },
          { header: 'Phần mềm', key: 'software', width: 10 },
          { header: 'Đề xuất', key: 'dexuat', width: 10 },
          { header: 'Ghi chú', key: 'notes', width: 10 },
          { header: 'Tình Trạng', key: 'tinhtrang', width: 10 },
        ];
    
        // Thêm dữ liệu vào worksheet
        documents.forEach((document) => {
          worksheet.addRow({ 
            Ma: document.Ma, 
            UGDN: document.UGDN,
            email: document.email,
            serial: document.serial,
            Mainboard: document.Mainboard,
            RAM: document.RAM,
            CPU: document.CPU,
            HardDisk: document.HardDisk,
            Nguoidung: document.Nguoidung,
            Didong: document.Didong,
            BoPhan: document.BoPhan,
            Loai: document.Loai,
            headcount: document.headcount,
            noilamviec: document.noilamviec,
            software: document.software,
            ngaymua: document.ngaymua,
            ngayhethan: document.ngayhethan,
            dexuat: document.dexuat,
            notes: document.notes,
            tinhtrang: document.tinhtrang,
        });
        });
    
        // Tạo file Excel và gửi về client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
        await workbook.xlsx.write(res);
        res.end();
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  
})

router.get('/backupdatabase', async (req, res) => {
    await toolmongo.backupMongo(process.env.DATABASE_URL,(callback)=>{
        console.log(callback)
        fs.readFile(callback, (err, data) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              // Thiết lập các header cho response
              res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename=backup.gz', // Tên tệp tin khi tải về
              });
        
              // Gửi nội dung của tệp tin
              res.end(data);
            }
        })
    })
    

})

// router.get('/mainSbadmin_hethong', authenticated, (req, res) => {
//     res.render("mainSbAdmin/mainSbadmin_hethong",{
//         _username: req.user.username,
//         activeuser: '',
//         activetb: '',
//         activetbdp2: '',
        
//     })
// })

router.get('/printgiayracong', (req, res) => {
    var congtacA = ''
    var congtacB = ''
    if(req.query.selectloaict == '1'){
        congtacA = 'X'
    }else{
        congtacB = 'X'
    }
    let data = {
        congtacA : congtacA,
        congtacB : congtacB,
        ngay: req.query.txtngay,
        bophan: req.query.selectbophan,
        headcount: req.query.selectheadcount,
        time: req.query.txttime,
        name: req.query.txthoten,
        lydo: req.query.txtlydo
    }
    res.render('docs/giayracong', {data: data})
    // res.render('docs/testgiayracong')
})

router.get('/giayracong', (req, res) => {
    res.render('mainSbAdmin/ingiayracong',{
        _username: ''
    })
})

router.get('/baocao', (req, res) => {
    let motacongviec = 'toi\n là \n 1 con người \n hoàn chỉnh'
    let fixmotacongviec = motacongviec.replace(/\n/g, '<br>')
    let data = {
        motacongviec: fixmotacongviec,
        ketquacongviec: `1. Kết quả thứ nhất <br> 2. Kết quả thứ 2 <br> 3. Kết quả thứ 3`
    }
    res.render('docs/report', {data: data ? data : null})
})


router.get('/nhapreport', (req, res) => {
    res.render('mainSbAdmin/reportmain', {
        _username: '',
        expressFlash: req.flash('success') ,
        expressFlasheror: req.flash('error')
    })
})
module.exports = router