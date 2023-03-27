import axios from "axios";

/*export let dataData = {
    wrench: {
        // Usage
        electricity: 20,
        electricityOff: false,
        steam: 70,
        steamOff: false,
        water: 50,
        waterOff: false,
        air: 30,
        airOff: false,

        // Work
        workingTime: 24,
        downTime: 6,
        productCount: 100,
        cyclopentaneCosts: 142,
        electricityCosts: 3000,
        waterCosts: 2000,
    },
    cogs: {
        // Usage
        electricity: 0,
        electricityOff: false,
        steam: 70,
        steamOff: false,
        water: 50,
        waterOff: false,
        air: 30,
        airOff: false,

        // Work
        workingTime: 24,
        downTime: 6,
        productCount: 100,
        cyclopentaneCosts: 142,
        electricityCosts: 3000,
        waterCosts: 2000,
    },
    hammer: {
        // Usage
        electricity: 0,
        electricityOff: false,
        steam: 70,
        steamOff: false,
        water: 50,
        waterOff: false,
        air: 30,
        airOff: false,

        // Work
        workingTime: 24,
        downTime: 6,
        productCount: 100,
        cyclopentaneCosts: 142,
        electricityCosts: 3000,
        waterCosts: 2000,
    },
    rocket: {
        // Usage
        electricity: 0,
        electricityOff: false,
        steam: 70,
        steamOff: false,
        water: 50,
        waterOff: false,
        air: 30,
        airOff: false,

        // Work
        workingTime: 24,
        downTime: 6,
        productCount: 100,
        cyclopentaneCosts: 142,
        electricityCosts: 3000,
        waterCosts: 2000,
    },
    lab: {
        // Usage
        electricity: 0,
        electricityOff: false,
        steam: 70,
        steamOff: false,
        water: 50,
        waterOff: false,
        air: 30,
        airOff: false,

        // Work
        workingTime: 24,
        downTime: 6,
        productCount: 100,
        cyclopentaneCosts: 142,
        electricityCosts: 3000,
        waterCosts: 2000,
    }
}*/

export const getData = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/auth/index.html`,
        )
        let dataData = response.data[0]
        return dataData
        //console.log(dataData)
    } catch (e) {
        alert(e.response.data.message)
    }
}