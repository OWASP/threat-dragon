<template>
  <div id="props-card">
    <!--
            All entities have the following properties:
                - Name (text input)
                - Description (text area)
                - type (not shown in properties)

            Process, Store, Actor, Flow share the following (not boundaries):
                - outOfScope
                - reasonOutOfScope
                - hasOpenThreats
                - threats

            Process:
                - handlesCardPayment
                - handlesGoodsOrServices
                - isWebApplication
                - privilegeLevel

            Store:
                - isALog
                - storesCredentials
                - isEncrypted
                - isSigned
                - storesInventory

            Actor:
                - providesAuthentication

            Flow:
                - isBidirectional
                - protocol
                - isEncrypted
                - isPublicNetwork
        -->

    <b-row v-show="!cellRef">
      <b-col>
        <p>{{ $t('threatmodel.properties.emptyState') }}</p>
      </b-col>
    </b-row>

    <b-form v-if="!!cellRef && cellRef.data">
      <b-form-row>
        <b-col md="6">
          <b-form-group
            id="name-group"
            label-cols="auto"
            :label="
              cellRef.data && cellRef.data.type === 'tm.Text'
                ? $t('threatmodel.properties.text')
                : $t('threatmodel.properties.name')
            "
            label-for="name"
          >
            <b-form-textarea
              id="name"
              v-model="cellRef.data.name"
              @update="onChangeName()"
              :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
              graphPro
            ></b-form-textarea>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type !== 'tm.Text'" md="6">
          <b-form-group
            id="description-group"
            label-cols="auto"
            :label="$t('threatmodel.properties.description')"
            label-for="description"
          >
            <b-form-textarea
              id="description"
              v-model="cellRef.data.description"
              @change="onChangeProperties()"
            ></b-form-textarea>
          </b-form-group>
        </b-col>

        <b-col
          v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text' && cellRef.data.type !== 'tm.Flow'"
          md="6"
        >
          <b-form-group label-cols="auto" id="outofscope-group">
            <b-form-checkbox id="outofscope" v-model="cellRef.data.outOfScope" @change="onChangeScope()">{{
              $t('threatmodel.properties.outOfScope')
            }}</b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'" md="6">
          <b-form-group label-cols="auto" id="flowoutofscope-group">
            <b-form-checkbox id="flowoutofscope" v-model="cellRef.data.outOfScope" @change="onChangeScope()">{{
              $t('threatmodel.properties.outOfScope')
            }}</b-form-checkbox>
            <b-form-checkbox id="bidirection" v-model="cellRef.data.isBidirectional" @change="onChangeBidirection()">{{
              $t('threatmodel.properties.bidirection')
            }}</b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'" md="6">
          <b-form-group
            id="reasonoutofscope-group"
            label-cols="auto"
            :label="$t('threatmodel.properties.reasonOutOfScope')"
            label-for="reasonoutofscope"
          >
            <b-form-textarea
              id="reasonoutofscope"
              :disabled="!cellRef.data.outOfScope"
              v-model="cellRef.data.reasonOutOfScope"
              @change="onChangeProperties()"
            ></b-form-textarea>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Process'">
          <b-form-group
            id="privilegelevel-group"
            label-cols="auto"
            :label="$t('threatmodel.properties.privilegeLevel')"
            label-for="privilegelevel"
          >
            <b-form-input
              id="privilegelevel"
              v-model="cellRef.data.privilegeLevel"
              @change="onChangeProperties()"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Process'">
          <b-form-group label-cols="auto" id="process-handles-group">
            <b-form-checkbox
              id="handlesCardPayment"
              v-model="cellRef.data.handlesCardPayment"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.handlesCardPayment') }}</b-form-checkbox
            >
            <b-form-checkbox
              id="handlesGoodsOrServices"
              v-model="cellRef.data.handlesGoodsOrServices"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.handlesGoodsOrServices') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Process'">
          <b-form-group label-cols="auto" id="web-app-group">
            <b-form-checkbox
              id="isWebApplication"
              v-model="cellRef.data.isWebApplication"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.isWebApplication') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="isalog-group">
            <b-form-checkbox id="isalog" v-model="cellRef.data.isALog" @change="onChangeProperties()">{{
              $t('threatmodel.properties.isALog')
            }}</b-form-checkbox>
            <b-form-checkbox
              id="storesCredentials"
              v-model="cellRef.data.storesCredentials"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.storesCredentials') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="isEncrypted-group">
            <b-form-checkbox id="isEncrypted" v-model="cellRef.data.isEncrypted" @change="onChangeProperties()">{{
              $t('threatmodel.properties.isEncrypted')
            }}</b-form-checkbox>
            <b-form-checkbox id="isSigned" v-model="cellRef.data.isSigned" @change="onChangeProperties()">{{
              $t('threatmodel.properties.isSigned')
            }}</b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="storesInventory-group">
            <b-form-checkbox
              id="storesInventory"
              v-model="cellRef.data.storesInventory"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.storesInventory') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Actor'">
          <b-form-group label-cols="auto" id="providesAuthentication-group">
            <b-form-checkbox
              id="providesAuthentication"
              v-model="cellRef.data.providesAuthentication"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.providesAuthentication') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group
            id="protocol-group"
            label-cols="auto"
            :label="$t('threatmodel.properties.protocol')"
            label-for="protocol"
          >
            <b-form-input
              id="protocol"
              v-model="cellRef.data.protocol"
              @change="onChangeProperties()"
              type="text"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group label-cols="auto" id="isEncrypted-group">
            <b-form-checkbox id="isEncrypted" v-model="cellRef.data.isEncrypted" @change="onChangeProperties()">{{
              $t('threatmodel.properties.isEncrypted')
            }}</b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group label-cols="auto" id="isPublicNetwork-group">
            <b-form-checkbox
              id="isPublicNetwork"
              v-model="cellRef.data.isPublicNetwork"
              @change="onChangeProperties()"
              >{{ $t('threatmodel.properties.publicNetwork') }}</b-form-checkbox
            >
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-form>
  </div>
</template>

<style lang="scss">
label {
  font-size: 12px !important;
}
</style>

<script>
import { mapState } from 'vuex';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdGraphProperties',
    computed: mapState({
        cellRef: (state) => state.cell.ref
    }),
    methods: {
        updateComponent() {
            // should not need to need to force an update
            this.$forceUpdate();
        },
        onChangeName() {
            dataChanged.updateName(this.cellRef);
            this.updateComponent();
        },
        onChangeBidirection() {
            dataChanged.updateProperties(this.cellRef);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.updateComponent();
        },
        onChangeProperties() {
            dataChanged.updateProperties(this.cellRef);
            this.updateComponent();
        },
        onChangeScope() {
            document.getElementById('reasonoutofscope').disabled = !this.cellRef.data.outOfScope;
            dataChanged.updateProperties(this.cellRef);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.updateComponent();
        }
    }
};
</script>
