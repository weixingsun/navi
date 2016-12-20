# navi - an very simple google map like navigation app, using latest react native (0.39)

function 1: show current location on map

function 2: User inputs keywords to search nearby locations match it, then choose one location as destination from search result

function 3: Select one of the three modes (Transit, Drive and Walk)

function 4: Show one route on the map between current location and destination, the route mode is the selected mode

function 5: Choosing other modes could display one corresponding route on the map

function 6: User can reverse current and destination location (wip)

function 7: Share the route to others (wip)


non-functional 1: unit test using jest, all cases in __tests__ , all passed

non-functional 2: end2end test using appium, https://github.com/weixingsun/navi_appium, all passed

non-functional 3: supported OS: ios, android

non-functional 4: eslint (wip)


How to install:

1. git clone 

2. npm i --save

3. react-native run-android ( --variant=release )

Unit test steps

1. npm test / jest

2. check report

