import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getOrdersByUserId, getCouponsByUserId } from '@/lib/db';

/**
 * SMART CHATBOT API
 * This system uses an Intent-Based logic to simulate AI behavior for FREE.
 * It provides personalized data from the dashboard while maintaining security.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, userId } = body;
        const msg = message.toLowerCase();
        let reply = "";

        // 1. SECURITY & ADMIN BLOCK
        if (msg.includes('admin') || msg.includes('password') || msg.includes('users list') || msg.includes('database')) {
            return NextResponse.json({ 
                reply: "⚠️ **Security Warning**: I'm sorry, I cannot provide any information regarding administrative details, user lists, or sensitive system credentials. I am here to assist with shopping, products, and your personal orders only." 
            });
        }

        // 2. OFF-TOPIC DETECTION (Out of Box)
        const isOffTopic = !msg.includes('veg') && !msg.includes('order') && !msg.includes('product') && 
                          !msg.includes('coupon') && !msg.includes('track') && !msg.includes('buy') && 
                          !msg.includes('shop') && !msg.includes('price') && !msg.includes('total') && 
                          !msg.includes('count') && !msg.includes('how many') && !msg.includes('help') &&
                          !msg.includes('hi') && !msg.includes('hello');
        
        if (isOffTopic && msg.length > 15) {
            return NextResponse.json({ 
                reply: "I am a specialized assistant for **VegFresh Shopping**. I don't have information on general topics outside of our garden and your orders. \n\nHow can I help you with your purchase today? 🥕" 
            });
        }

        // 3. PRODUCT INQUIRIES & RECOMMENDATIONS
        if (msg.includes('product') || msg.includes('good') || msg.includes('best') || msg.includes('recommend') || msg.includes('vegetable')) {
            const products = getProducts();
            const topProducts = products.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
            
            if (msg.includes('price') || msg.includes('cost')) {
                reply = "Here are the current prices for our top products:\n" + 
                    topProducts.map(p => `• **${p.name}**: ₹${p.price} per ${p.unit}`).join('\n');
            } else {
                reply = "Based on freshness and customer ratings, I highly recommend:\n" + 
                    topProducts.map(p => `• **${p.name}** (${p.rating} ⭐) - Perfect for healthy meals!`).join('\n') +
                    "\n\nWould you like me to find a specific category for you?";
            }
        }
        
        // 4. ORDER TRACKING & DETAILS (Personal Data)
        else if (msg.includes('order') || msg.includes('track')) {
            if (!userId) {
                reply = "I see you're asking about orders! Please **Sign In** to your account so I can look up your personal history and tracking details.";
            } else {
                const orders = getOrdersByUserId(userId);
                
                if (msg.includes('how many') || msg.includes('count') || msg.includes('list')) {
                    reply = `You have placed total **${orders.length} orders** with us. You can view all of them in your [My Orders](/orders) page.`;
                } else if (orders.length === 0) {
                    reply = "I couldn't find any orders in your history. Time to pick some fresh veggies! 🛒";
                } else {
                    const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                    const statusLabels: Record<string, string> = {
                        placed: 'Placed (awaiting confirmation)',
                        confirmed: 'Confirmed & being packed',
                        preparing: 'Being prepared',
                        out_for_delivery: 'Out for delivery! 🛵',
                        delivered: 'Successfully delivered! ✅',
                        cancelled: 'Cancelled'
                    };

                    if (msg.includes('amount') || msg.includes('total') || msg.includes('price')) {
                        reply = `The total amount for your latest order (#${latestOrder.id}) was **₹${latestOrder.total}**. \n(Subtotal: ₹${latestOrder.subtotal}, Delivery: ₹${latestOrder.deliveryFee}${latestOrder.discount > 0 ? `, Discount: -₹${latestOrder.discount}` : ''})`;
                    } else {
                        reply = `Your latest order (#${latestOrder.id}) status is: **${statusLabels[latestOrder.orderStatus] || latestOrder.orderStatus}**.\n\nIt contains ${latestOrder.items.length} items and was placed on ${new Date(latestOrder.createdAt).toLocaleDateString()}.`;
                    }
                }
            }
        }

        // 5. COUPON & REWARD INQUIRIES
        else if (msg.includes('coupon') || msg.includes('offer') || msg.includes('reward') || msg.includes('discount')) {
            if (!userId) {
                reply = "We offer mystery scratch cards for every order above ₹100! Sign in to see what you've earned.";
            } else {
                const coupons = getCouponsByUserId(userId);
                const available = coupons.filter(c => !c.isUsed && c.isScratched).length;
                const unscratched = coupons.filter(c => !c.isScratched).length;
                
                if (msg.includes('how many') || msg.includes('count')) {
                    reply = `You have **${available} unused coupons** and **${unscratched} scratch cards** waiting to be revealed! Find them in your [Rewards](/rewards) section.`;
                } else {
                    reply = available > 0 
                        ? `Good news! You have **${available} coupons** ready to use. Just select them at checkout to save money! 💸`
                        : `You have **${unscratched} mystery scratch cards** waiting for you. Go to your rewards page to reveal your prizes!`;
                }
            }
        }
        
        // GREETINGS & HELP
        else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            reply = "Hi there! I'm your VegFresh Assistant. I can help you with:\n• Tracking your order status & amounts\n• Checking how many orders or coupons you have\n• Finding the best products & prices\n\nWhat can I do for you today?";
        }
        
        else {
            reply = "I'm sorry, I'm not sure how to answer that specific question. I can help with **tracking orders, product prices, order counts, and rewards**. \n\nCould you try asking something like 'track my order' or 'how many coupons do I have'?";
        }

        return NextResponse.json({ reply });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
