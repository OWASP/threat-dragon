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
            <div class="form-check">
              <input
                id="outofscope"
                :checked="cellRef.data.outOfScope"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.outOfScope = $event.target.checked; onChangeScope()"
              >
              <label class="form-check-label" for="outofscope">
                {{ $t('threatmodel.properties.outOfScope') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'" md="6">
          <b-form-group label-cols="auto" id="flowoutofscope-group">
            <div class="form-check">
              <input
                id="flowoutofscope"
                :checked="cellRef.data.outOfScope"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.outOfScope = $event.target.checked; onChangeScope()"
              >
              <label class="form-check-label" for="flowoutofscope">
                {{ $t('threatmodel.properties.outOfScope') }}
              </label>
            </div>
            <div class="form-check">
              <input
                id="bidirection"
                :checked="cellRef.data.isBidirectional"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isBidirectional = $event.target.checked; onChangeBidirection()"
              >
              <label class="form-check-label" for="bidirection">
                {{ $t('threatmodel.properties.bidirection') }}
              </label>
            </div>
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
            <div class="form-check">
              <input
                id="handlesCardPayment"
                :checked="cellRef.data.handlesCardPayment"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.handlesCardPayment = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="handlesCardPayment">
                {{ $t('threatmodel.properties.handlesCardPayment') }}
              </label>
            </div>
            <div class="form-check">
              <input
                id="handlesGoodsOrServices"
                :checked="cellRef.data.handlesGoodsOrServices"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.handlesGoodsOrServices = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="handlesGoodsOrServices">
                {{ $t('threatmodel.properties.handlesGoodsOrServices') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Process'">
          <b-form-group label-cols="auto" id="web-app-group">
            <div class="form-check">
              <input
                id="isWebApplication"
                :checked="cellRef.data.isWebApplication"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isWebApplication = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isWebApplication">
                {{ $t('threatmodel.properties.isWebApplication') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="isalog-group">
            <div class="form-check">
              <input
                id="isalog"
                :checked="cellRef.data.isALog"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isALog = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isalog">
                {{ $t('threatmodel.properties.isALog') }}
              </label>
            </div>
            <div class="form-check">
              <input
                id="storesCredentials"
                :checked="cellRef.data.storesCredentials"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.storesCredentials = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="storesCredentials">
                {{ $t('threatmodel.properties.storesCredentials') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="isEncrypted-group">
            <div class="form-check">
              <input
                id="isEncrypted"
                :checked="cellRef.data.isEncrypted"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isEncrypted = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isEncrypted">
                {{ $t('threatmodel.properties.isEncrypted') }}
              </label>
            </div>
            <div class="form-check">
              <input
                id="isSigned"
                :checked="cellRef.data.isSigned"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isSigned = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isSigned">
                {{ $t('threatmodel.properties.isSigned') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group label-cols="auto" id="storesInventory-group">
            <div class="form-check">
              <input
                id="storesInventory"
                :checked="cellRef.data.storesInventory"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.storesInventory = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="storesInventory">
                {{ $t('threatmodel.properties.storesInventory') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Actor'">
          <b-form-group label-cols="auto" id="providesAuthentication-group">
            <div class="form-check">
              <input
                id="providesAuthentication"
                :checked="cellRef.data.providesAuthentication"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.providesAuthentication = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="providesAuthentication">
                {{ $t('threatmodel.properties.providesAuthentication') }}
              </label>
            </div>
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
            <div class="form-check">
              <input
                id="isEncrypted"
                :checked="cellRef.data.isEncrypted"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isEncrypted = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isEncrypted">
                {{ $t('threatmodel.properties.isEncrypted') }}
              </label>
            </div>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group label-cols="auto" id="isPublicNetwork-group">
            <div class="form-check">
              <input
                id="isPublicNetwork"
                :checked="cellRef.data.isPublicNetwork"
                class="form-check-input"
                type="checkbox"
                @change="cellRef.data.isPublicNetwork = $event.target.checked; onChangeProperties()"
              >
              <label class="form-check-label" for="isPublicNetwork">
                {{ $t('threatmodel.properties.publicNetwork') }}
              </label>
            </div>
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
