var express = require("express")
var router =  express.Router()
var passport = require("../config/passport")
var xulydb = require("../CRUD/xulydb")
var moment = require('moment')
// const toolmongo = require("../tool_mongo/backup")
// const sendmail = require('../sendmail/sendmail')
const exceljs = require('exceljs');
const fs = require('fs')

//sendmail.sendmail()

router.get('/cronjobsendmail',async(req, res) => {
    var data =  await xulydb.doc_createthietbi()
    var newdata = await tinhngayconlai(data)
    sendmail.sendmail(newdata)
    res.status(200).send('ok');

})

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
        const documents = await xulydb.docdevices();
    
        // Tạo workbook và worksheet của Excel
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Documents');
    
        // Đặt tên các cột
        worksheet.columns = [
          { header: 'Ten TB', key: 'name', width: 20 },
          { header: 'Vi Tri', key: 'location', width: 20 },
          { header: 'Cong Suat', key: 'power', width: 20 },
          { header: 'Modem', key: 'modem', width: 20 },
          { header: 'Ghichu', key: 'note', width: 20 },
          { header: 'Username', key: 'username', width: 20 },
        ];
    
        // Thêm dữ liệu vào worksheet
        documents.forEach((document) => {
          worksheet.addRow({ 
            name: document.name, 
            location: document.location, 
            power: document.power, 
            modem: document.modem, 
            note: document.note, 
            username: document.username, 
        });
        });
    
        // Tạo file Excel và gửi về client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=documents.xlsx');
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

module.exports = router