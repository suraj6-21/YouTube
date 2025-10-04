
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}

export { asyncHandler }







// const asyncHandler = (requestHandler) => async (err, req, res, next) =>{
//     try {
//         await requestHandler(err, req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// }