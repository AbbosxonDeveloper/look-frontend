const clientId = document.querySelector('#clientId')
const userForm = document.querySelector('#userForm')
const foodsForm = document.querySelector('#foodsForm')
const foodsCount = document.querySelector('#foodsCount')
const userHeader = document.querySelector('#userHeader')
const ordersList = document.querySelector('.orders-list')
const foodsSelect = document.querySelector('#foodsSelect')
const usernameInput = document.querySelector('#usernameInput')
const customersList = document.querySelector('.customers-list')
const telephoneInput = document.querySelector('#telephoneInput')


let API = 'http://localhost:4000'
async function renderOrders(userId) {
    ordersList.innerHTML = null
    let response = await fetch(API + '/order')
    let orders = await response.json()
    console.log(orders)

    for (let order of orders) {
        const [li, img, div, count, name] = createElements('li', 'img', 'div', 'span', 'span')
        const food = order.food

        count.textContent = order.count
        name.textContent = food.foodName

        li.classList.add('order-item')
        name.classList.add('order-name')
        count.classList.add('order-count')


        img.src = food.foodImg

        div.append(name, count)
        li.append(img, div)
        ordersList.append(li)
    }
}




async function renderUsers() {
    customersList.innerHTML = null

    let response = await fetch(API + '/users')
    let users = await response.json()
    console.log(users)

    for (let user of users) {
        const [li, span, a] = createElements('li', 'span', 'a')

        span.textContent = user.username
        a.textContent = '+' + user.contact

        span.classList.add('customer-name')
        li.classList.add('customer-item')
        a.classList.add('customer-phone')

        a.setAttribute('href', 'tel:+' + user.contact)

        li.append(span, a)
        customersList.append(li)

        li.onclick = () => {
            clientId.textContent = user.userId
            userHeader.textContent = user.username

            renderOrders(clientId.textContent);

        }
    }
}




async function renderFoods() {

    let response = await fetch(API + '/foods')
    let foods = await response.json()
    console.log(foods)


    for (let food of foods) {
        const [option] = createElements('option')
        option.textContent = food.foodName
        option.value = food.foodId

        foodsSelect.append(option)
    }
}






userForm.onsubmit = async event => {
    event.preventDefault()
    const username = usernameInput.value.trim()
    const contact = telephoneInput.value.trim()

    if (!(username.length < 30 && username.length)) {
        return alert('Wrong username')
    }

    if (!(/^998[389][012345789][0-9]{7}$/).test(contact)) {
        return alert('Invalid contact!')
    }

    let response = await fetch(API + '/users', {
        method: "POST",
        body: JSON.stringify({ username: username, contact: contact })
    })



    usernameInput.value = null
    telephoneInput.value = null

    renderUsers()
}







foodsForm.onsubmit = async event => {
    event.preventDefault()

    if (!foodsSelect.value) return
    if (!clientId.textContent) return
    if (!foodsCount.value || foodsCount.value > 10) return

    let response = await fetch(API + '/order', {
        method: "POST",
        body: JSON.stringify({ foodId: foodsSelect.value, userId: clientId.textContent, count: foodsCount.value })
    })
    let order = await response.json()
    console.log(order)

    foodsSelect.value = 1
    foodsCount.value = null

    renderOrders(response.data.userId)
}


renderFoods()
renderUsers()
renderOrders()