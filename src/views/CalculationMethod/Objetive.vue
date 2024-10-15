<template>
    <fieldset>
        <legend>{{ $t('objetives') }}</legend>
        <ods-col :md="24" :sm="24">
            <div class="actionContainer" v-if="!form.objetives">
                <p class="title">{{ $t("noObjetives") }}</p>
                <ods-button type="primary" :circle="true" icon="ods-icon-plus" @click="handleTabsEdit('p1', 'add')" />
            </div>
            <ods-tabs v-if="form.objetives && form.objetives.length > 0" v-model="tabIndex" type="card" editable
                @edit="handleTabsEdit">
                <ods-tab-pane v-for="(item, index) in form.objetives" :key="item.type" :label="item.type"
                    :name="item.type">
                    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
                        <ods-row :gutter="20">

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('type')" :rules="[errors.required]">
                                    <ods-select v-model="form.objetives[index].type" placeholder=""
                                        @change="handleOnChangeType(form.objetives[index].type)">
                                        <ods-option v-for="item in types" :key="item" :label="item" :value="item" />
                                    </ods-select>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('limitTime')" :rules="[errors.required]">
                                    <ods-input type="number" v-model="form.objetives[index].limitTimes"></ods-input>
                                </ods-form-item>
                            </ods-col>


                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('target')" :rules="[errors.required]">
                                    <ods-input type="number" v-model="form.objetives[index].target"></ods-input>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('targetUOM')" :rules="[errors.required]">
                                    <ods-select v-model="form.objetives[index].targetUM" placeholder="">
                                        <ods-option v-for="item in targetUOMs" :key="item" :label="item"
                                            :value="item" />
                                    </ods-select>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('compare')" :rules="[errors.required]">
                                    <ods-select v-model="form.objetives[index].compare" placeholder="">
                                        <ods-option v-for="item in compares" :key="item" :label="item" :value="item" />
                                    </ods-select>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('numberOfTimes')" :rules="[errors.required]">
                                    <ods-input type="number" v-model="form.objetives[index].numberOfTimes"></ods-input>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('evaluationTime')" :rules="[errors.required]">
                                    <ods-input type="number" v-model="form.objetives[index].evaluationTime"></ods-input>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('evaluationTimeUM')" :rules="[errors.required]">
                                    <ods-select v-model="form.objetives[index].evaluationTimeUM" placeholder="">
                                        <ods-option v-for="item in times" :key="item" :label="item" :value="item" />
                                    </ods-select>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('consecutiveTimes')" :rules="[errors.required]">
                                    <ods-input type="number" v-model="form.objetives[index].consecutiveTimes">
                                    </ods-input>
                                </ods-form-item>
                            </ods-col>

                            <ods-col :md="12" :sm="24">
                                <ods-form-item :label="$t('consecutiveTimesUM')" :rules="[errors.required]">
                                    <ods-select v-model="form.objetives[index].consecutivesTimesUM" placeholder="">
                                        <ods-option v-for="item in times" :key="item" :label="item" :value="item" />
                                    </ods-select>
                                </ods-form-item>
                            </ods-col>

                        </ods-row>
                    </ods-form>
                </ods-tab-pane>
            </ods-tabs>

        </ods-col>
    </fieldset>
</template>
<script>
import errors from '@/config/InputErrors'
import _ from 'lodash'

export default {
    name: 'Objetives',
    props: {
        dialogVisible: Boolean,
        objetives: {
            type: Array,
            default: null
        },
        submit: Boolean
    },
    mounted() {
        if (this.objetives) {
            this.form = { objetives: this.objetives }
            this.preventDuplicatedTypes()
        } else {
            this.form = {}
        }
    },
    data() {
        return {
            loading: false,
            modules: [],
            form: {
                objetives: []
            },
            errors,
            tabIndex: 'p1',
            targetUOMs: ['%', 'hrs', 'min', 'sec', 'Kbit/s'],
            types: ['p1', 'p2', 'p3', 'Overall'],
            compares: ['<', '>'],
            times: ['Months', 'Days', 'hrs', 'min']
        }
    },
    methods: {
        toggleLoading() {
            this.loading = !this.loading
        },
        handleOnChangeType(value) {
            this.preventDuplicatedTypes()
            this.tabIndex = value

        },
        preventDuplicatedTypes() {
            this.types = ['p1', 'p2', 'p3', 'Overall']
            this.types = _.filter(this.types, (t) => { return !_.find(this.form.objetives, { 'type': t }) })
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                if (this.form.objetives) {
                    this.form.objetives.push({
                        type: this.types[0]
                    })
                    this.tabIndex = this.types[0]
                } else {
                    this.form = {
                        objetives: [{
                            type: this.types[0]
                        }]
                    }
                    this.tabIndex = this.types[0]
                }
            }
            if (action === 'remove') {
                if (this.tabIndex === targetName) {
                    this.form.objetives.forEach((tab, index) => {
                        if (tab.type === targetName) {
                            let nextTab = this.form.objetives[index + 1] || this.form.objetives[index - 1]
                            if (nextTab) {
                                this.tabIndex = nextTab.type
                            }
                        }
                    })
                }
                this.form.objetives = this.form.objetives.filter(tab => tab.type !== targetName)
            }
            this.preventDuplicatedTypes()
        },
        async handleSubmit() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.$emit('submit')
                }
            })
        }
    },
    watch: {
        'dialogVisible': function () {
            if (this.objetives) {
                this.form = { objetives: this.objetives }
                this.preventDuplicatedTypes()
            } else {
                this.form = {}
            }
        },
        'submit': function () {
            this.handleSubmit()
        }
    }
}

</script>
<style scoped>
fieldset {
    margin: 10px;
    border: 1px solid silver;
    padding: 8px;
    border-radius: 4px;
}

legend {
    font-size: larger;
    font-weight: 500;
    padding: 5px;
}

.actionContainer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.title {
    color: rgb(133, 130, 130);
    font-size: larger;
    margin-top: 5px;
}
</style>