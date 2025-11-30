import express from 'express';
import Contact from "../models/Contact"

import { authenticate } from '../middleware/auth';


const router = express.Router();


router.use(authenticate)

router.get("/",async(req,res)=>{
    const contacts = await Contact.find({organizationId:req.user.organizationId})
    res.json(contacts)
});


router.post("/",async(req,res)=>{
    const contact = await Contact.create({
        ...req.body,
        organizationId:req.user.organizationId
    }).
    res.status(201).json(contact)
});

router.put("/:id",async(req,res)=>{

const contact = await Contact.findOneAndUpdate(

    {
        _id:req.params.id,organizationId:req.user.organizationId
    },
    req.body,
    {new:true}
);

if(!contact) return res.status(404).json({error:"contact not found"});

res.json(contact)

});


router.delete("/:id",async(req,res)=>{

    const contact = await Contact.findOneAndDelete({
        _id:req.params.id,
        organizationId:req.user.organizationId
    });

    if(!contact) return res.status(404).json({error:"Contact not found"})

        res.json({ok:true})
});

export default router ;