const path = require('path');
const Employee = require('../models/employee');
const Efficiency = require('../models/efficiency');
const mongoose = require('mongoose');
const efficiency = require('../models/efficiency');
const nodemailer = require('nodemailer');


function sendMail(mail, subject, text){
     let body = {
          from: 'ahmednasr.fci97@gmail.com',
          to: mail,
          subject: subject,
          text: text
      }
      
      const transporter =nodemailer.createTransport({
          service: 'gmail',
          auth:{
              user: 'ahmednasr.fci97@gmail.com',
              pass : 'ahmedfci20150043'
          }
      })
       
      transporter.sendMail(body,(err, result) =>{
          if (err) {
              console.log(err);
          }
          console.log(result);
          console.log("email sent");
      })
}

function calcNetTime(date, attendenceTime, leaveTime, endBreakTime){
     let dailyNetTime = ((new Date((new Date(date).getFullYear()),(new Date(date)).getMonth(),(new Date(date)).getDate(),leaveTime.slice(0,2),leaveTime.slice(3,5)))
                         -(new Date((new Date(date).getFullYear()),(new Date(date)).getMonth(),(new Date(date)).getDate(),endBreakTime.slice(0,2),endBreakTime.slice(3,5))))
                         +((new Date((new Date(date).getFullYear()),(new Date(date)).getMonth(),(new Date(date)).getDate(),12,0))
                         -(new Date((new Date(date).getFullYear()),(new Date(date)).getMonth(),(new Date(date)).getDate(),attendenceTime.slice(0,2),attendenceTime.slice(3,5))));
     return dailyNetTime; 
}
exports.getAddEmployee = (req, res, next) => {
     console.log(req.session.admin);
     res.render('admin/add_employee',{
          admin: req.session.admin

     });
}

exports.postEmployee = (req, res, next) => {
     const fname = req.body.firstName;
     const lname = req.body.lastName;
     const postion = req.body.postion;
     const salary = req.body.salary;
     const phoneNo = req.body.phoneNo;
     const email = req.body.email;
     const city = req.body.city;
     const employee = new Employee({
          fullName: fname + ' ' + lname,
          postion: postion,
          salary: salary,
          phoneNo: phoneNo,
          email: email,
          city: city
     }); 
     employee.save()
     .then(result => {
          res.redirect('/admin/employees');
     })
     
}

exports.getEmployees = (req, res, next) => {
     Employee.find()
     .then(employees => {
          res.render('admin/employees',{
               employees: employees,
               admin: req.session.admin
          })
     })
     .catch(err => {
          console.log(err);
     })
}

exports.getAddWorkingHours = (req, res, next) => {
     const employeeId = req.params.id;
     let date = new Date();
     console.log(date);
     date = date.toISOString().split('T')[0];
     console.log(date);
     Efficiency.findOne({$and:[{employeeId: employeeId },{ date: date}]})
     .then(efficiency => {
          console.log(efficiency); 
          if(efficiency){
               res.render('admin/update_employee_working_hours',{
                              efficiency: efficiency,
                              employeeId: employeeId,
                              admin: req.session.admin
               });
          }
          res.render('admin/employee_working_hours',{
               employeeId: employeeId,
               admin: req.session.admin
          });
     });
}

exports.postAddWorkingHours = (req, res, next) => {
     const employeeId = req.body.employeeId;
     const attendenceTime = req.body.attendenceTime;
     const leaveTime = req.body.leaveTime;
     const endBreakTime = req.body.endBreakTime;
     const date = req.body.date;
     console.log(date)
     const exactlyWorkingHours = req.body.workingHours;
     let dailyNetTime = calcNetTime(date, attendenceTime, leaveTime, endBreakTime);
     dailyNetTime = dailyNetTime/(1000*60*60);
     let dailyEfficiency = exactlyWorkingHours/dailyNetTime;
     Employee.findById(employeeId)
     .then(emp => {
          const email = emp.email;
          const subject = "Working Today";
          console.log(email);
          const description = "your working today was unefficient and this will influence about U , please working hard ";
          if(dailyEfficiency < 0.5){
             sendMail(email, subject, description);
          }
          const efficiency = new Efficiency({
               employeeId: new mongoose.Types.ObjectId(employeeId),
               attendenceTime: attendenceTime,
               leaveTime: leaveTime,
               endBreakTime: endBreakTime,
               date: date,
               dailyNetTime: dailyNetTime,
               dailyEfficiency: dailyEfficiency,
               workingHours: exactlyWorkingHours
          });
          return efficiency.save();
     })
     .then(result => {
          res.redirect('/admin/employees');
     })
     .catch(err => console.log(err));
}
exports.postUpdateWorkingHours = (req, res, next) => {
     const efficiencyId = req.body.efficiencyId;
     const attendenceTime = req.body.attendenceTime;
     const leaveTime = req.body.leaveTime;
     const endBreakTime = req.body.endBreakTime;
     const employeeId = mongoose.Types.ObjectId(req.body.employeeId);
     const date = req.body.date;
     const exactlyWorkingHours = req.body.workingHours;
     Efficiency.findById(efficiencyId)
     .then(efficiency => {
          efficiency.attendenceTime = attendenceTime;
          efficiency.leaveTime = leaveTime;
          efficiency.endBreakTime = endBreakTime;
          efficiency.employeeId = employeeId;
          efficiency.date = date;
          efficiency.dailyNetTime = calcNetTime(efficiency.date, efficiency.attendenceTime, efficiency.leaveTime, efficiency.endBreakTime)/(1000*60*60);
          efficiency.dailyEfficiency = exactlyWorkingHours/efficiency.dailyNetTime;
          efficiency.workingHours = exactlyWorkingHours;
          return efficiency.save();
     })
     .then(result => {
          res.redirect('/admin/employees');
     })
     
}