import React, { useContext, useEffect, useState } from 'react'
import './orders.css'
import { assets } from '../../assets/assets'
import { StoredContext } from '../../context'

export default function Orders() {
    const [orders,setOrders] = useState([]);
    const {user} = useContext(StoredContext);


    useEffect(() => {
        const deletePendingOrdersAndFetch = async () => {
            try {
                // Delete pending orders
                const deleteResponse = await fetch('/api/delete-pending-orders', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                // if (!deleteResponse.ok) {
                //     const errorData = await deleteResponse.json();
                //     console.error('Error deleting pending orders:', errorData.message);
                //     return;  // Stop further execution if deletion fails
                // }
    
                // Fetch orders only if the deletion was successful
                if (user) {
                    const response = await fetch('/api/get-my-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 'email': user.email })
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        setOrders(result.orders);
                        
                    } else {
                        console.error('Error fetching orders:', await response.json());
                    }
                }
            } catch (error) {
                console.error('Error in deletePendingOrdersAndFetch:', error);
            }
        };
    
        deletePendingOrdersAndFetch();
    }, [user?.email]);
    





    if(orders.length==0) {
      return (
        <div className="no-item">You have no Pending Orders...!</div>
      )
    } else
    return (
        <div className="orders-container">
          {orders.map((order, orderIndex) => {
            // Group items by restaurant for each order
            const groupedItems = order.orderItems.reduce((acc, item) => {
              if (!acc[item.restaurant]) {
                acc[item.restaurant] = [];
              }
              acc[item.restaurant].push(item);
              return acc;
            }, {});
      
            return (
              <div className="order-block" key={orderIndex}>
                <div className="order-header">
                  <h2>Order #{orderIndex + 1}</h2>
                </div>
      
                {/* Loop through grouped items by restaurant */}
                {Object.entries(groupedItems).map(([restaurant, items], index) => (
                  <div className="restaurant-block" key={index}>
                    <h3 className="restaurant-name">{restaurant}</h3>
                    <div className="food-list">
                      {items.map((item, key) => (
                        <div className="item" key={key}>
                          <div className="item-details">
                            <span className="dish-name">{item.item_name} x <span className='dish-quantity'>{item.quantity}</span></span>
                            <span className="dish-price">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-bottom">
                      <div className="items-count">Items: {items.length}</div>
                      <button className="order-status">{items[0].status}</button>
                    </div>
                    
                  </div>
                ))}
      
                <div className="total-price">
                  <strong>Total: ${order.price}</strong>
                </div>
              </div>
            );
          })}
        </div>
      );
      
    };

    

//   return (
//     <div>
//       <h2>My Orders</h2>
//       {order}
//     </div>
//   )
// }
