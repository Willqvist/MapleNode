import express from "express";
import DBConn from "../core/database/DatabaseConnection";
const router = express.Router();

router.get("/",(req,res)=>
{
    console.log("IM HERE");
    return res.render("index");
});
router.get("/ranking",(req,res)=>
{
    return res.render("pages/ranking",{user:req.session.user});
});
router.get("/login",(req,res)=>
{
    if(req.session.user) res.redirect("dashboard");
    return res.render("pages/dashboardLogin");
});
router.get("/register",(req,res)=>
{
    if(req.session.user) res.redirect("dashboard");
    return res.render("pages/register");
});
router.get("/play",async (req,res)=>
{
    let data = await DBConn.instance.getDownloads();
    res.render("pages/play",{user:req.session.user,downloads:data})
});
router.get("/download",(req,res)=>
{
    return res.render("pages/play",{user:req.session.user});
});
router.get("/status",(req,res)=>
{
    return res.render("pages/status",{user:req.session.user});
});
router.get("/vote",async (req,res)=>
{
    let data = await DBConn.instance.getVotes();
    res.render("pages/vote",{user:req.session.user,votes:data});
});
export default router;
