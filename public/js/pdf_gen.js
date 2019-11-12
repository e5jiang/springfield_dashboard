$(document).ready(function() {
    $('#download').click(function() {       
        html2canvas($('#content').get(0)).then( function (canvas) {  
                var doc = new jsPDF("p", "mm", "letter");
                var width = doc.internal.pageSize.getWidth();
                var height = doc.internal.pageSize.getHeight();
                var imgData = canvas.toDataURL('image/png');              
                doc.addImage(imgData, 'PNG', 0, 0, width, height);
                doc.save('mcdonalds_report.pdf');
        });
    });
})