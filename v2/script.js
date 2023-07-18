$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true
});

$(function () {
  var includes = $('[data-include]')
  $.each(includes, function () {
    var file = './components/' + $(this).data('include') + '/index.html'
    $(this).load(file)
  })
})
