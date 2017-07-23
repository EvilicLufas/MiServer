var express = require('express');
var router = express.Router();
var db = require("../models/mongo.js");

var options = {
    root: __dirname + '/../'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.user = {
        _id: "5974096afbe6f076f80f724a"
    }
    res.render('index', { fragment: 1 })
});

router.get('/detail/:id', function(req, res, next) {
    var detailId = req.params.id;
    db.queryDetailById(detailId, function(detail) {
        console.log("here is " + detail);
        res.render('detail', { detailName: detail.name, detailId: detailId });
    });
});

router.post('/detail/shopcart', function(req, res, next) {
    if (!req.session.user) {
        res.send('login');
    } else {
        var detail = req.body;
        db.queryUserById(req.session.user._id, function(user) {
            var shoppingcart = user.shoppingcart;
            shoppingcart.push(detail);
            db.updateUser(req.session.user._id, { shoppingcart: shoppingcart }, function(success) {
                console.log(success);
                if (success) {
                }
            });
            res.send("success");
        })
    }
});
router.post('/payment/topay', function(req, res, next) {
    if (!req.session.user) {
        res.send('login');
    } else {
        var detail = req.body;
        console.log(detail);
        db.queryUserById(req.session.user._id, function(user) {
            var payment = user.payment;
            for(var i=0;i<payment.length;i++)
            {
                if(payment[i].orderState=="待付款")
                {
                    payment[i].orderRecAddr=detail.orderRecAddr;
                    payment[i].orderRecDate=detail.orderRecDate;
                    payment[i].orderBuyer=detail.orderBuyer;
                    payment[i].orderPayMethod=detail.orderPayMethod;
                    payment[i].orderDate=detail.orderDate;
                    payment[i].orderState=detail.orderState;
                    payment[i].orderId=detail.orderId;
                    break;    
                }
            }
            db.updateUser(req.session.user._id, { payment: payment }, function(success) {
                console.log(success);
                if (success) {
                    // //成功加入数据库之后跳转之订单详情页面
                    // res.render('myorder',{uuserId: user._id});
                    //res.redirect("/myorder");
                }
            });
            res.send("success");
        })
    }
});

router.get('/payment', function(req, res, next) {
    if (!req.session.user) {
        res.render('login');
    } else {
        console.log(req.session.user._id);
        db.queryUserById(req.session.user._id, function(user) {
            console.log(user);
            res.render('payment', { userId: user._id });
        })
    }
});

router.get('/address', function(req, res, next) {
    if (!req.session.user) {
        res.render('login');
    } else {
        console.log(req.session.user._id);
        db.queryUserById(req.session.user._id, function(user) {
            console.log(user);
            res.render('address', { userId: user._id });
        })
    }
});

router.post('/address/update', function(req, res, next) {
    if (!req.session.user) {
        res.render('login');
    } else {
        console.log(req.session.user._id);
        db.queryUserById(req.session.user._id, function(user) {
            var address = user.address;
            var item = req.body;
            address[item.number].name = item.name;
            address[item.number].phone = item.phone;
            address[item.number].addr = item.addr;
            db.updateUser(req.session.user._id, { address: address }, function(success) {
                console.log(success);
                if (success) {
                    res.render("address", { userId: user._id });
                }
            });
        })
    }
});
router.get('/myorder/:id', function(req, res, next) {
    if (!req.session.user) {
        res.render('login');
    } else {
        console.log(req.session.user._id);
        db.queryUserById(req.session.user._id, function(user) {
            console.log(user);
            res.render('myorder', { userId: user._id,state: req.params.id });
        })
    }
});
router.post('/myorder/changestate', function(req, res, next) {
    if (!req.session.user) {
        res.send('login');
    } else {
        var detail = req.body;
        db.queryUserById(req.session.user._id, function(user) {
            var payment = user.payment;
            console.log("detail-count="+detail.count);
            payment[detail.count].orderState = "已完成";
            db.updateUser(req.session.user._id, { payment: payment }, function(success) {
                console.log(success);
                if (success) {
                    
                }
            });
            res.send("success");
        })
    }
});
router.get('/ordernull', function(req, res, next) {
    res.render('ordernull', { detailName: '小米6' });
});

router.get('/search', function(req, res, next) {
    res.render('search', { detailName: '小米6' });
});

router.get('/fragments/:id', function(req, res, next) {
    var frag_id = req.params.id;
    switch (frag_id) {
        case "1":
            res.render('fragments/' + 1, { login: req.session.user });
            break;
        case "2":
            db.queryDetail(function(details) {
                var categories = {};
                for (var index = 0; index < details.length; index++) {
                    var element = details[index];
                    if (categories[element.category]) {
                        categories[element.category].push(element);
                    } else {
                        categories[element.category] = new Array();
                        categories[element.category].push(element);
                    }
                }
                res.render('fragments/' + 2, { details: details, categories: categories });
            })
            break;
        case "4":
            if (req.session.user) {
                db.queryUserById(req.session.user._id, function(user) {
                    res.render('fragments/' + 4, { login: user });
                })
            } else {
                res.redirect('/users/login');
            }
            break;
        default:
            res.render('fragments/' + frag_id);
            break;
    }
});

router.get('/mine', function(req, res, next) {
    res.render('index', { fragment: 4 });
});

router.get('/shopcart', function(req, res, next) {
    if (!req.session.user) {
        res.render('login');
    } else {
        db.queryUserById(req.session.user._id, function(user) {
            var details = user.shoppingcart;
            console.log(details);
            res.render('fragments/' + 3, { details: details });
        });
    }
});

router.get('/shopcart/:id', function(req, res, next) {
    db.queryUserById(req.session.user._id, function(user) {
        var shoppingcart = user.shoppingcart;
        console.log(shoppingcart);
        shoppingcart.splice(req.params.id, 1);
        console.log(shoppingcart);
        db.updateUser(req.session.user._id, { shoppingcart: shoppingcart }, function(success) {
            console.log(success);
            if (success) {
                res.send("success");
            }
        });
    })
});

router.post('/clearbutton', function(req, res, next) {
    db.queryUserById(req.session.user._id, function(user) {
        var shoppingcart = user.shoppingcart;
        var payment = user.payment;
        var check = req.body.check;
        console.log("111111111111");
        console.log(check);
        var neworder={
            orderId:"",
            orderState:"待付款",
            orderItemsPic:[],
            orderItemsName:[],
            orderDate:"",
            orderPayMethod:"",
            orderBuyer:"",
            orderRecDate:"",
            orderRecAddr:"",
            orderItemNum:"",
            orderItemMoney:""};
        for(index=0;index<shoppingcart.length;index++){
            if(check[index]=="1"){
                 neworder.orderItemsPic.push({url:shoppingcart[index].url});
                 neworder.orderItemsName.push({name:shoppingcart[index].goodsName});
                 shoppingcart.splice(index,1);
            }
        } 
        neworder.orderItemNum = req.body.allcounts;
        neworder.orderItemMoney = req.body.allprice;

        if(req.body.allcounts!='0'){
            payment.unshift(neworder); 
            db.updateUser(req.session.user._id, {shoppingcart: shoppingcart, payment:payment}, function(success) {
                console.log(success);
                if (success) {
                    res.send("success");
                }
            });
        }

    });
});

router.get('/img/:file', function(req, res, next) {
    console.log(req.params.file);
    res.sendFile('/public/images/details/' + req.params.file, options);
});

router.get('/json/:id', function(req, res, next) {
    db.queryDetailById(req.params.id, function(detail) {
        res.send(detail);
    });
});
router.get('/order/:id', function(req, res, next) {
    db.queryUserById(req.params.id, function(detail) {
        res.send(detail);
    });
});

router.get('/init', function(req, res, next) {
    db.init(function(cb) {
        res.send(cb);
    });
})

module.exports = router; 
