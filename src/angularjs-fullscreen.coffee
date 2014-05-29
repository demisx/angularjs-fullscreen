((angular)->
  "use strict"
  angular.module("app.fullscreen", [])
  .directive "myFullscreen", [
    "$document"
    ($document) ->
      _isFullscreenActive = ->
        (document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement)?

      _enter = (elem)->
        console.log "  entering fullscreen..."
        return if (elem.requestFullscreen and elem.requestFullscreen())
        return if (elem.msRequestFullscreen and elem.msRequestFullscreen())
        return if (elem.mozRequestFullScreen and elem.mozRequestFullScreen())
        return if (elem.webkitRequestFullscreen and
          elem.webkitRequestFullscreen Element.ALLOW_KEYBOARD_INPUT)
        return

      _exit =  ->
        console.log "  exiting fullscreen..."
        doc = $document[0]
        return if doc.exitFullscreen and doc.exitFullscreen()
        return if doc.mozCancelFullScreen and doc.mozCancelFullScreen()
        return if doc.webkitExitFullscreen and doc.webkitExitFullscreen()
        return if doc.msExitFullscreen and doc.msExitFullscreen()
        return

      (scope, element, attrs) ->
        console.log "attrs.myFullscreen=#{attrs.myFullscreen}"
        scope.$watch attrs.myFullscreen, (value) ->
          console.log "value = #{value}"
          if value
            element.addClass "fullscreen-active"
            _enter element[0]
            return
          else
            _exit()
            return

        $document.on "webkitfullscreenchange
                      mozfullscreenchange
                      fullscreenchange", ->
          
          # Do not do anything if entered fullscreen mode
          unless _isFullscreenActive()
            console.log "  removing .fullscreen-active class..."
            element.removeClass "fullscreen-active"
            scope.$apply ->
              scope.isFullscreen = false
          return

        return
  ]
) window.angular