const { addOrder, getOrder, addTransactionProof, updateOrder } = require("../models/order")
const upload = require("./multer")
const { imgUpload } = require("./profile")

const orderRoute = require("express").Router()

orderRoute.post('/add-order', async (req, res) => {
  const result = await addOrder(req.body.jumlah, req.body.userId, req.body.productId)
  if(result === 'success') return res.json({success: true})
  return res.json({success:false})
})

orderRoute.get('/get-order/:userId', async (req, res)=> {
  var result = await getOrder(req.params.userId)
  
  if (result[0].success) {
    result = result.slice(1).map((val)=>{
      val.total = val.jumlah_pesanan * val.harga
      return val
    })
    return res.json({success:true, data:result})
  }
  return res.json({success:false})
})

orderRoute.post('/bukti-transaksi', upload.any(), imgUpload, 
async (req, res) => {
  if(req.uploadResult?.secure_url === null) return res.json({success:false})
  const result = await addTransactionProof(req.body.orderId,req.uploadResult.secure_url)
  
  if(result==='success') return res.json({success:true})
  res.json({success:false})
})

orderRoute.put('/update-order', async (req, res) => {
  const result = await updateOrder(req.body.orderId, req.body.jumlah)
  if(result==='success') return res.json({success:true})
  res.json({success:false})
})

module.exports = orderRoute