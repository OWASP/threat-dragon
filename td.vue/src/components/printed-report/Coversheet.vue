<template>
    <div class="page print-only">
        <div class="td-title">
            <h1 class="td-report-title">{{ title }}</h1>
        </div>
        <div class="td-report-meta">
            <ul>
                <li class="td-owner"><strong>{{ $t('threatmodel.owner') }}</strong>: {{ owner }}</li>
                <li class="td-reviewer"><strong>{{ $t('threatmodel.reviewer') }}</strong>: {{ reviewer }}</li>
                <li class="td-contributors"><strong>{{ $t('threatmodel.contributors') }}</strong>: {{ (contributors || []).join(', ') }}</li>
                <li class="td-date-generated"><strong>{{ $t('report.dateGenerated') }}</strong>: {{ new Date().toDateString() }}</li>
            </ul>
        </div>
        <img
            v-if="branding"
            src="@/assets/threatdragon_logo_image.svg"
            alt="Threat Dragon Logo"
            class="td-brand-logo" />
        <em v-if="branding" class="td-brand-text">OWASP Threat Dragon</em>
    </div>
</template>

<style lang="scss" scoped>

.td-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 700px;
    padding-top: 200px;
    width: 100%;
}
.page {
    display: flex;
    flex-direction: column;
}

.td-report-title {
    font-size: 64px;
    font-weight: bolder;
}

.td-report-meta {
    margin-top: 50px;
    margin-bottom: 200px;

    ul {
        list-style: none;
        margin-right: 15px;
        li {
            text-align: right;
        }
    }
}

.td-brand-logo {
    max-height: 250px;
    max-width: 250px;
}
</style>

<script>
export default {
    name: 'TdPrintCoversheet',
    props: {
        title: String,
        owner: {
            type: String,
            required: false
        },
        reviewer: {
            type: String,
            required: false
        },
        contributors: {
            type: Array,
            required: false
        },
        branding: {
            type: Boolean,
            default: true
        }
    }
};
</script>
