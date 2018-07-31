(function(){
  angular.module('app')
  .factory('DeviceFactory', [DeviceFactory]);

  function DeviceFactory() {
    var devices = [];
    var devFactory = {
      addDevice: addDevice,
      getDevices: getDevices,
      getDevice: getDevice,
      reset: reset,
    };

    return devFactory;

    function addDevice(device) {
      deviced.push(device);
    }

    function getDevices() {
      return devices;
    }

    function getDevice(id) {
      var device_found = devices.filter(function(device){
        return device.id == id;
      });
      return device_found[0];
    }

    function doReset() {
      devices = [];
    }
  }

})();