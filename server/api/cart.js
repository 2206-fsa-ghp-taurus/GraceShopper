const router = require('express').Router();
const {
  models: { User, Order, Product, OrderItems },
} = require('../db');
module.exports = router;
const { requireToken } = require('./middleware');

// api/cart  (can think of orderItems as items in cart )
router.get('/', requireToken, async (req, res, next) => {
  try {
    let order = await Order.findOne({
      where: {
        userId: req.user.dataValues.id,
        status: 'open',
      },
    });
    if (!order) {
      order = await Order.create({
        status: 'open',
        userId: req.user.dataValues.id,
      });
    }

    res.send(
      await Order.findOne({
        where: {
          id: order.id,
        },
        include: [Product],
        order: [[Product, 'id', 'desc']], // adding order by so the result will not jump around
      })
    );
  } catch (ex) {
    next(ex);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

// router.post("/", requireToken, async (req, res, next) => {
//     try {
//         let order = await Order.findOne({
//             where: {
//                 userId: req.user.dataValues.id,
//                 status: 'open'
//             }
//         })
//         if (!order) {
//             order = await Order.create({
//                 status: 'open',
//                 userId: req.user.dataValues.id
//             })
//         }
//         let itemExist = await OrderItems.findOne({
//           where:{
//             productId: req.body.productId
//           }
//         })
//         if (itemExist) return;
//         else {await OrderItems.create({
//                   orderId: order.id,
//                   productId: req.body.productId,
//                   totalQuantity: req.body.totalQuantity,
//                   totalCost: req.body.totalCost
//           })

//           res.send(
//             await Order.findOne({
//               where:{
//                 id: order.id
//               },
//               include:[Product],
//               order:[[Product, 'id','desc']]
//             })
//           );
//         }

//     } catch (error) {
//       next(error);
//     }
//   });

/////////////////////////////////////////////////////////////////////////////////////////////////////

// for delete, no need things in request body, so just make it /id
router.delete('/:id', requireToken, async (req, res, next) => {
  try {
    let order = await Order.findOne({
      where: {
        userId: req.user.dataValues.id,
        status: 'open',
      },
    });
    if (!order) {
      order = await Order.create({
        status: 'open',
        userId: req.user.dataValues.id,
      });
    }

    await OrderItems.destroy({
      where: {
        productId: req.params.id,
      },
    });

    res.send(
      await Order.findOne({
        where: {
          id: order.id,
        },
        include: [Product],
        order: [[Product, 'id', 'desc']],
      })
    );
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////////////////////////

router.put('/', requireToken, async (req, res, next) => {
  try {
    let order = await Order.findOne({
      where: {
        userId: req.user.dataValues.id,
        status: 'open',
      },
    });
    if (!order) {
      order = await Order.create({
        status: 'open',
        userId: req.user.dataValues.id,
      });
    }

    let item = await OrderItems.findOne({
      where: {
        id: req.body.itemId,
      },
    });
    const newQuantity = item.totalQuantity + req.body.quantityChange;
    const newCost = (item.totalCost * newQuantity) / item.totalQuantity;

    if (newQuantity <= 0) return;

    await item.update({
      totalQuantity: newQuantity,
      totalCost: newCost,
    });

    res.send(
      await Order.findOne({
        where: {
          id: order.id,
        },
        include: [Product],
        order: [[Product, 'id', 'desc']],
      })
    );
  } catch (err) {
    next(err);
  }
});

router.post('/', requireToken, async (req, res, next) => {
  try {
    // step 1: find or create the order
    let order = await Order.findOne({
      where: {
        userId: req.user.dataValues.id,
        status: 'open',
      },
    });
    if (!order) {
      order = await Order.create({
        status: 'open',
        userId: req.user.dataValues.id,
      });
    }

    // step 2: check whether this item is already in the cart
    let itemExist = await OrderItems.findOne({
      where: {
        orderId: order.id,
        productId: req.body.productId,
      },
    });
    console.log(itemExist);
    // allowing user to add same item multiple times
    if (itemExist) {
      const newQuantity =
        itemExist.totalQuantity + parseInt(req.body.totalQuantity);
      const newCost = itemExist.totalCost + req.body.totalCost;
      await itemExist.update({
        totalQuantity: newQuantity,
        totalCost: newCost,
      });
    } else {
      await OrderItems.create({
        orderId: order.id,
        productId: req.body.productId,
        totalQuantity: req.body.totalQuantity,
        totalCost: req.body.totalCost,
      });
    }
    // step3: send back res
    res.send(
      await Order.findOne({
        where: {
          id: order.id,
        },
        include: [Product],
        order: [[Product, 'id', 'desc']],
      })
    );
  } catch (error) {
    next(error);
  }
});

router.put('/confirmation', async (req, res, next) => {
  try {
    if (req.headers.authorization !== 'guest'){
        if (req.body.id) { // user who has been logged in the whole time 
          console.log('user has been logged in the whole time')
          let order = await Order.findOne({
            where: {
              id: req.body.id,
              status: 'open',
            },
          });
          order.update({
            status: 'closed',
          });
          res.send(
            await Order.findOne({
              where: {
                id: order.id,
              },
              include: [Product],
              order: [[Product, 'id', 'desc']],
            })
          );
        } else { 
          console.log('guest decided to log in')
          const user = await User.findByToken(req.headers.authorization)
          let order = await Order.create({
            status: 'closed',
            userId: user.id
          });
          for (let i = 0; i < req.body.products.length; i++) {
            await OrderItems.create({
              orderId: order.id,
              productId: req.body.products[i].orderItems.productId,
              totalQuantity: req.body.products[i].orderItems.totalQuantity,
              totalCost: req.body.products[i].orderItems.totalCost,
            });
          }
          res.send(
            await Order.findOne({
              where: {
                id: order.id,
              },
              include: [Product],
              order: [[Product, 'id', 'desc']],
            })
          );
        }
    } else { // guest check out 
      console.log('guest checkout')
      let guestOrder = await Order.create({
        status: 'closed',
      });
      for (let i = 0; i < req.body.products.length; i++) {
        await OrderItems.create({
          orderId: guestOrder.id,
          productId: req.body.products[i].orderItems.productId,
          totalQuantity: req.body.products[i].orderItems.totalQuantity,
          totalCost: req.body.products[i].orderItems.totalCost,
        });
      }
      res.send(
        await Order.findOne({
          where: {
            id: guestOrder.id,
          },
          include: [Product],
          order: [[Product, 'id', 'desc']],
        })
      );
    }
  } catch (err) {
    next(err);
  }
});