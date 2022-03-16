// -----JS CODE-----
// -----JS CODE-----

//@input Component.Camera camera

var transform = script.getTransform();
var event = script.createEvent("UpdateEvent");

event.bind(function (eventData)
{
var transform = script.getTransform();
var rotation = transform.getLocalRotation();
var rotateBy = script.camera.getTransform().getWorldRotation().y;
rotation.y = rotateBy;
transform.setLocalRotation(rotation);
});