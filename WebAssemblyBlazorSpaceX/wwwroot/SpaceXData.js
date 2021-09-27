/*
*
* Display the date and time of each mission, the rocket name, and whether the launch was a success.
* Display the time of the mission in Central Time (CT)
* Order the launches in reverse chronological order
* For each launch, include a column that ranks the payload mass, with the heaviest payload being rank 1
*
*/

//GLOBAL VARIABLES
var missions = [], rockets = [], payloads = [];
//CLICK EVENT FOR SORTING BY MISSION DATE
function DefaultSort() {
    console.log("Default Sort");
    setTimeout(function () {
        $("table thead tr").find("th:contains('MissionDate')").click();
    }, 0);
}
//GET missions, called by FetchData.razor
function GetMissions(promiseHandler) {
    //GetRockets();
    //GetPayloads();

    return new Promise((resolve, reject) => {
        GetRockets().then(() => {
            GetPayloads().then(() => {
                $.get('https://api.spacexdata.com/v5/launches', (responseLaunches) => {
                    $.each(responseLaunches, (i, launch) => {
                        missions.push({
                            'RocketName': rockets.filter((obj) => { return obj.id === launch.rocket; })[0].name,
                            'MissionDate': convertUTCtoCDT(new Date(launch.date_utc)),
                            'LaunchSuccess': (launch.failures == undefined || launch.failures.length == 0) && launch.success ? true : false,
                            'PayloadMass': GetPayloadMass(launch.payloads)
                        });
                    });
                }).then(() => {
                    var max = Math.max.apply(Math, missions.map(function (o) { return o.PayloadMass; }));
                    missions.forEach(function (el) { el.Rank = el.PayloadMass == max ? 1 : 0 });
                    resolve(missions);
                    /*promiseHandler.invokeMethodAsync('SetResult', JSON.stringify(missions));*/
                });
            });
        });
    });
}

//GET ROCKETS, called by FetchData.razor
function GetRockets() {
    return new Promise((resolve, reject) => {
        $.get('https://api.spacexdata.com/v4/rockets', (responseRockets) => {
            $.each(responseRockets, (i, rocket) => {
                rockets.push(rocket);
            });
        }).then(() => {
            resolve();
        });
    });
}

//PRIVATE METHODS USED IN GetMissions

//GET PAYLOADMASS
function GetPayloadMass(launchPayloads) {
    var totalMass = 0;
    $.each(launchPayloads, (i, payloadID) => {
        try {
            totalMass += parseFloat(payloads.filter((obj) => { return obj.id === payloadID })[0].mass_lbs) || 0;
        }
        catch (e) {
            alert("There is a problem in the data at index: " + i + ". item: " + JSON.stringify(payloads.filter((obj) => { return obj.id === payloadID })[0]));
        }
    });
    return totalMass;
}

//GET PAYLOADS
function GetPayloads() {
    return new Promise((resolve, reject) => {
        $.get('https://api.spacexdata.com/v4/payloads', (responsePayloads) => {
            $.each(responsePayloads, (i, payload) => {
                payloads.push(payload);
            });
        }).then(() => {
            resolve();
        });
    });
}

//CONVERT UTC TO CDT
function convertUTCtoCDT(utc) {
    return new Date(utc.getTime() - ((1 * 60 * 60 * 1000) * 6/*5*/));
}