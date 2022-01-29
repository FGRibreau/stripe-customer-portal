const { STRIPE_SECRET_KEY } = process.env

const stripe = require("stripe")(STRIPE_SECRET_KEY)

const get_customer_by_email = async (customer_email) => {
    const customers = await stripe.customers.list({
        email: customer_email,
        limit: 1
    })
    return customers.data.pop()
}

const generate_portal_link = async (customer_id) => {
    const session = await stripe.billingPortal.sessions.create({
        customer: customer_id
    })

    return session.url
}

module.exports = {
    get_customer_by_email,
    generate_portal_link
}
