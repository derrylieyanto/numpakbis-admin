<div id='app'>
    <div class='container'>
        <h1>Vue <strong>&lt;select-search&gt;</strong> component</h1>
        <p>Use arrow keys (up and down) on the input field to switch between previous and next item</p>
        <p>Hit enter on the input field to select, or use your mouse to manually select from select box</p>
        <select-search v-model='firstExample' :items='ppl' :shows='"name"'></select-search>
        <p>Result: {{ firstExample }}</p>
        <p>First option doesn't necessarily have to be disabled</p>
        <select-search v-model='secondExample' :items='ppl' :shows='"name"' :first-disabled='false' :first-label='"ALL"'></select-search>
        <p>Result: {{ secondExample }}</p>
        <p>Button at the end to make it feel like an inline form</p>
        <select-search v-model='thirdExample' :items='ppl' :shows='"name"' :add-btn='true' @selected='thirdExampleSelected'></select-search>
        <p>Smashing enter on the input or clicking the button emits an 'selected' event, so you can listen for it on the parent</p>
        <p>Customize which item key is returned as a result (default: id)</p>
        <select-search v-model='fourthExample' :items='ppl' :shows='"name"' :returns='"name"'></select-search>
        <p>Result: {{ fourthExample }}</p>
    </div>
</div>

<template id='my-template'>
    <div class='input-group col' style='padding:0'>
        <div class='input-group-prepend'>
            <span class='input-group-text'><i class='fa fa-search'></i>&nbsp;{{ getCount() }}</span>
        </div>
        <input type='text' class='form-control'
            v-model='searchQuery'
            placeholder='Search'
            @keyup.enter='addItem'
            @keyup.up='prevItem'
            @keyup.down='nextItem'
            @keyup.esc='close'
        >
        <select class='form-control d-inline' v-model='selectedItem' @change='manualChange'>
            <option :disabled='firstDisabled' value=0>
                <template v-if='addedItem == 0 && !firstDisabled'>=></template> {{ firstLabel }}
            </option>
            <option v-for='item in searchedItems' :key='item.id' :value='item[returns]'>
                <template v-if='addedItem == item[returns]'>=></template> {{ formOptionText(item) }}
            </option>
        </select>
        <div class='input-group-append' v-if='addBtn'>
            <button class='btn btn-primary' @click='addItem'><i class='fa fa-chevron-right'></i></button>
        </div>
    </div>
</template>