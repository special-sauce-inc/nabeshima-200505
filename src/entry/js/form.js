$('.resume input').on('change', function () {
    var file = $(this).prop('files')[0];
    $('.resume p').text(file.name);
});
$('.curriculum input').on('change', function () {
    var file = $(this).prop('files')[0];
    $('.curriculum p').text(file.name);
});
