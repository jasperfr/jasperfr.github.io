function abtable(k, title) {
    return $(`<td>
        ${title}<br>Autobuyer <span class="slow-ab-${k}">(slow)</span><br><br>
        <button class="btn-ab-${k}" onclick="call('buyAutobuyer', '${k}')">Cost: <span class="cost-ab-${k}"></span></button>
        <div class="div-ab-${k}" style="display:none;">
            <input class="chk-ab-${k}" checked type="checkbox" onchange="call('toggleAutobuyer', '${k}')"><span>Enabled</span><br>
            <input class="chk-ab-max-${k}" checked type="checkbox" onchange="call('toggleMaxAutobuyer', '${k}')"><span>Buy Max</span>
        </div>
    </td>`);
}

$(() => {
    const b = 'b';
    const p = 'p';
    const i = 'i';
    const c = 'c';
    let $tr;
    $tr = $('<tr>');
        $tr.append(abtable(1, '1st Generator'));
        $tr.append(abtable(2, '2nd Generator'));
        $tr.append(abtable(3, '3rd Generator'));
    $('.tbl-autobuyers').append($tr);
    $tr = $('<tr>');
        $tr.append(abtable(4, '4th Generator'));
        $tr.append(abtable(5, '5th Generator'));
        $tr.append(abtable(6, '6th Generator'));
    $('.tbl-autobuyers').append($tr);
    $tr = $('<tr>');
        $tr.append(abtable(7, '7th Generator'));
        $tr.append(abtable(8, '8th Generator'));
        $tr.append(abtable(b, 'Booster'));
    $('.tbl-autobuyers').append($tr);
    $tr = $('<tr>');
        $tr.append(abtable(c, 'Collapse'));
        $tr.append(abtable(p, 'Prestige'));
        $tr.append(abtable(i, 'Infinity'));
    $('.tbl-autobuyers').append($tr);
});
