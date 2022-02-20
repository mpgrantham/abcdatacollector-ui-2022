import { jsPDF } from "jspdf";

export const buildDataSheet = (observed) => {

    // page is 294 wide

    // 147 - 5 = 142 (for margins)
    // 142 - 10 = 132 (for middle space)

    const doc = new jsPDF({
        orientation: "landscape"
    });

    doc.text("Observed: " + observed.observedNm, 5, 10);
    doc.setFontSize(10);

    buildSheet(doc, 7, observed);
    buildSheet(doc, 154, observed);

    doc.line(5,15,142,15);
    doc.line(142,15,142,205);
    doc.line(142,205,5,205);
    doc.line(5,205,5,15);

    doc.line(152,15,289,15);
    doc.line(289,15,289,205);
    doc.line(289,205,152,205);
    doc.line(152,205,152,15);
            
    doc.save("Datasheet-" + observed.observedNm + ".pdf");
}

const buildSheet = (doc, startX, observed) => {

    let yIdx = 20;

    doc.text("Date/Time: ", startX, yIdx);
    doc.text("Location: ", startX + 70, yIdx);
    yIdx += 7;
    doc.text("Duration: ", startX, yIdx);
    doc.text("Intensity: ", startX + 70, yIdx);

    doc.line(startX - 2,yIdx + 5,startX + 135,yIdx + 5);

    yIdx += 10;
   
    doc.text("Antecedent", startX + 2, yIdx);
    doc.text("Behavior", startX + 46, yIdx);
    doc.text("Consequence", startX + 90, yIdx);
 
    doc.line(startX - 2,yIdx + 3,startX + 135,yIdx + 3);

    yIdx += 9;

    const firstIdx = yIdx;

    let lastIdx = yIdx;
    
    observed.antecedents.forEach(a => {
        doc.line(startX + 2,yIdx,startX + 4,yIdx);
        doc.text(a.typeValue, startX + 5, yIdx);
        // doc.text(a.typeValue, startX + 2, yIdx);
        yIdx += 8;
        if ( yIdx > lastIdx ) {
            lastIdx = yIdx;
        }
    });
   
    yIdx = firstIdx;
    observed.behaviors.forEach(b => {
        doc.line(startX + 46,yIdx,startX + 48,yIdx);
        doc.text(b.typeValue, startX + 49, yIdx);
        //doc.text(b.typeValue, startX + 46, yIdx);
        yIdx += 8;
        if ( yIdx > lastIdx ) {
            lastIdx = yIdx;
        }
    });
   
    yIdx = firstIdx;
    observed.consequences.forEach(c => {
        doc.line(startX + 90,yIdx,startX + 92,yIdx);
        doc.text(c.typeValue, startX + 93, yIdx);
        //doc.text(c.typeValue, startX + 90, yIdx);
        yIdx += 8;
        if ( yIdx > lastIdx ) {
            lastIdx = yIdx;
        }
    });

    doc.line(startX - 2,lastIdx,startX + 135,lastIdx);
   
    doc.text("Description:", startX, lastIdx + 5);
}