import Chart from 'chart.js/auto';
import {dataData, getData} from "./actions/data.js";
//import CanvasJS from 'canvasjs';

const factory = {
    rooms: document.getElementById('menu__list'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings-tabs'),
    settingsPanels: document.getElementById('settings-panels'),
    electricityLine: document.getElementById('electricity-line'),
    electricityRound: document.getElementById('electricity-round'),
    electricity: document.getElementById('electricity'),
    electricityButton: document.getElementById('electricity-button'),
    electricitySaveButton: document.getElementById('save-electricity'),
    electricityPowerButton: document.getElementById('power'),
    work: {
        workingTime: document.getElementById('wtime'),
        downTime: document.getElementById('dtime'),
        productCount: document.getElementById('items-count'),
        cyclopentaneCosts: document.getElementById('cyclo-costs'),
        electricityCosts: document.getElementById('electricity-costs'),
        waterCosts: document.getElementById('water-costs'),
    },
    sliders: {
        water: document.getElementById('water-slider'),
        steam: document.getElementById('steam-slider'),
        air: document.getElementById('air-slider'),
    },
    switchers: {
        steam: document.getElementById('steam-power'),
        water: document.getElementById('water-power'),
        air: document.getElementById('air-power'),
    }
}
/*const workshops = {
    wrench: 'Цех 1',
    cogs: 'Цех 2',
    hammer: 'Цех 3',
    rocket: 'Цех 4',
    lab: 'Цех 5'
}*/
let activeWorkshop = 'wrench'
let activeTab = 'statistics'

// Панель настроек комнаты ===============================================================================

let workshopsData

getData().then(ans => {
    workshopsData = ans
    console.log(workshopsData)
})




// Выбор комнаты =========================================================================================
function selectedWorkshop(workshop) {
    const selectedWorkshop = factory.rooms.querySelector('.selected')
    if (selectedWorkshop) {
        selectedWorkshop.classList.remove('selected')
    }
    if (workshop) {
        const newSelectedWorkshop = factory.rooms.querySelector(`[data-workshop=${workshop}]`)
        const {
            electricity,
            steam,
            water,
            air,
            steamOff,
            waterOff,
            airOff,
            workingTime,
            downTime,
            productCount,
            cyclopentaneCosts,
            electricityCosts,
            waterCosts,
        } = workshopsData[workshop]
        activeWorkshop = workshop

        newSelectedWorkshop.classList.add('selected')
        renderScreen(true)

        factory.electricity.innerText = electricity
        renderElectricity(electricity)
        setElectricityPower()
        changeSettingsType(activeTab)

        changeSlider(steam, factory.sliders.steam)
        changeSlider(water, factory.sliders.water)
        changeSlider(air, factory.sliders.air)

        changeSwitch(factory.switchers.steam, steamOff)
        changeSwitch(factory.switchers.water, waterOff)
        changeSwitch(factory.switchers.air, airOff)

        factory.work.workingTime.innerText = workingTime
        factory.work.downTime.innerText = downTime
        factory.work.productCount.innerText = productCount
        factory.work.cyclopentaneCosts.innerText = cyclopentaneCosts
        factory.work.electricityCosts.innerText = electricityCosts
        factory.work.waterCosts.innerText = waterCosts
    }
}

// Выбор цеха ===========================================================================================
factory.rooms.querySelectorAll('.menu__item').forEach(workshop => {
    // Начальный авто-рендер данных =====================================================================
    const value = factory.rooms.querySelector('.menu__item')
    selectedWorkshop(value.dataset.workshop)

    workshop.onclick = () => {
        const value = workshop.dataset.workshop
        selectedWorkshop(value)
    }
})

// Отображение нужного цеха =============================================================================
function renderScreen(isRooms) {
    if (isRooms) {
        factory.settings.style.display = 'block'
    } else {
        factory.rooms.style.display = 'none'
    }
}

// Отрисовка изменения мощности =========================================================================
function renderElectricity(electricity) {
    const min = 0;
    const max = 400;
    const range = max-min;
    const percent = range/100;

    const lineMin = 54;
    const lineMax = 276;
    const lineRange = lineMax - lineMin;
    const linePercent = lineRange/100;

    const roundMin = -240;
    const roundMax = 48;
    const roundRange = roundMax - roundMin;
    const roundPercent = roundRange/100;


    if (electricity >= min && electricity <= max) {
        const finishPercent = Math.round((electricity - min) / percent)
        const lineFinishPercent = lineMin + (linePercent * finishPercent)
        const roundFinishPercent = roundMin + (roundPercent * finishPercent)
        factory.electricityLine.style.strokeDasharray = `${lineFinishPercent} 276`
        factory.electricityRound.style.transform = `rotate(${roundFinishPercent}deg`
        factory.electricity.innerText = electricity
    }
}

// Изменения мощности ===================================================================================
function changeElectricity() {
    let mouseOver = false
    let mouseDown = false
    let position = 0
    let range = 0
    let change = 0

    factory.electricityButton.onmouseover = () => {
        mouseOver = true
        mouseDown = false
    }
    factory.electricityButton.onmouseout = () => mouseOver = false
    factory.electricityButton.onmouseup = () => mouseDown = false
    factory.electricityButton.onmousedown = (e) => {
        mouseDown = true
        position = e.offsetY
        range = 0
    }
    factory.electricityButton.onmousemove = (e) => {
        if (mouseOver && mouseDown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -10);
            if (newChange !== change) {
                let electricity = +factory.electricity.innerText
                if (newChange < change) {
                    electricity = electricity - 20
                } else {
                    electricity = electricity + 20
                }
                change = newChange
                //workshopsData[activeWorkshop].electricity = electricity - чтобы только по кнопке
                // применять изменение мощности
                renderElectricity(electricity)
            }
        }
    }
}
changeElectricity()

// Сохранение мощности ======================================================================================
factory.electricitySaveButton.onclick = () => {
    workshopsData[activeWorkshop].electricity = +factory.electricity.innerText
}

// Отключение питания =======================================================================================
factory.electricityPowerButton.onclick = () => {
    const power = factory.electricityPowerButton
    power.classList.toggle('off')
    if (power.matches('.off')) {
        workshopsData[activeWorkshop].electricityOff = true
    } else {
        workshopsData[activeWorkshop].electricityOff = false
    }
}

// Установка значения кнопки включения питания ===============================================================
function setElectricityPower() {
    if (workshopsData[activeWorkshop].electricityOff) {
        factory.electricityPowerButton.classList.add('off')
    } else {
        factory.electricityPowerButton.classList.remove('off')
    }
}


/* Переключение настроек */
factory.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
        const optionType = tab.dataset.type
        activeTab = optionType
        changeSettingsType(optionType)
    }
})

// Смена панели настроек ====================================================================================
function changeSettingsType(type) {
    const tabSelected = factory.settingsTabs.querySelector('.tab.selected')
    const tab = factory.settingsTabs.querySelector(`[data-type=${type}]`)
    const panelSelected = factory.settingsPanels.querySelector('.selected')
    const panel = factory.settingsPanels.querySelector(`[data-type=${type}]`)

    tabSelected.classList.remove('selected')
    tab.classList.add('selected')
    panelSelected.classList.remove('selected')
    panel.classList.add('selected')
}

// Функция изменения слайдера ===============================================================================
function changeSlider(percent, slider) {
    if (percent > 0 && percent <= 100) {
        const {type} = slider.parentElement.parentElement.dataset
        slider.querySelector('span').innerText = percent
        slider.style.height = `${percent}%`
        workshopsData[activeWorkshop][type] = percent
    }
}

// Отслеживание и изменение слайдера =========================================================================
function watchSlider(slider) {
    let mouseOver = false
    let mouseDown = false
    let position = 0
    let range = 0
    let change = 0

    const parent = slider.parentElement

    parent.onmouseover = () =>{
        mouseOver = true
        mouseDown = false
    }
    parent.onmouseout = () => mouseOver = false
    parent.onmouseup = () => mouseDown = false
    parent.onmousedown = (e) => {
        mouseDown = true
        position = e.offsetY
        range = 0
    }
    parent.onmousemove = (e) => {
        if (mouseOver && mouseDown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -0.1);
            if (newChange !== change) {
                let percent = +slider.querySelector('span').innerText
                if (newChange < change) {
                    percent = percent - 1
                } else {
                    percent = percent + 1
                }
                change = newChange
                //workshopsData[activeWorkshop].electricity = electricity - чтобы только по кнопке
                // применять изменение мощности
                changeSlider(percent, slider)
            }
        }
    }
}
watchSlider(factory.sliders.steam)
watchSlider(factory.sliders.water)
watchSlider(factory.sliders.air)

// Включение/выключение пара, воды ..... ========================================================================
function changeSwitch(switcher, isOff) {
    if (isOff) {
        switcher.classList.add('off')
    } else {
        switcher.classList.remove('off')
    }
    workshopsData[activeWorkshop][`${switcher.parentElement.dataset.type}Off`] = isOff
    //console.log(workshopsData[activeWorkshop])
}

// Клик по переключателю ======================================================================================
factory.switchers.steam.onclick = (e) => {
    const isOff = !factory.switchers.steam.matches('.off')
    const switcher = e.target.parentElement
    changeSwitch(switcher, isOff)
}
factory.switchers.water.onclick = (e) => {
    const isOff = !factory.switchers.water.matches('.off')
    const switcher = e.target.parentElement
    changeSwitch(switcher, isOff)
}
factory.switchers.air.onclick = (e) => {
    const isOff = !factory.switchers.air.matches('.off')
    const switcher = e.target.parentElement
    changeSwitch(switcher, isOff)
}

// Статический график chart js =======================================================================
(async function() {
    const ctx = document.getElementById('chart').getContext('2d')
    const ctx2 = document.getElementById('chart-2').getContext('2d')
    const ctx3 = document.getElementById('chart-3').getContext('2d')

    let delayed;

    let gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(126, 120, 238, 1)") //#7e78ee
    gradient.addColorStop(1, "rgba(189, 173, 236, 0.2)") //#bdadec

    let data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
    ];

    const configData = {
        labels: data.map(row => row.year),
        datasets: [
            {
                label: 'График расхода',
                data: data.map(row => row.count),
                fill: true,
                backgroundColor: gradient,
                borderColor: 'rgba(126, 120, 238, 1)',
                pointBackgroundColor: "#fff",
                //tension: 0.2,
            }
        ]
    }

    const config = {
        type: 'line',
        data: configData,
        options: {
            radius: 4,
            hitRadius: 30,
            hoverRadius: 6,
            responsive: true,
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === "data" && context.mode === "default" && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay
                },
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            return "" + value + "kg"
                        }
                    }
                }
            },
            tooltips: {

            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true,
                }
            }
        }
    }
    let chart = new Chart(ctx,config);
    let chart2 = new Chart(ctx2,config);
    let chart3 = new Chart(ctx3,config);

    // Логика динамического изменения графиков расхода
    setInterval(() => {
        let dataR = Math.random() * (100 - 1) + 1;
        let now = new Date();
        let res = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

        chart.data.labels.push(res);
        chart.data.labels.shift();

        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(dataR);
            dataset.data.shift();
        });
        chart.update();
        chart2.update();
        chart3.update();
    }, 3000)
})();