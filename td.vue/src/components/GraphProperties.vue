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
                - privilegeLevel

            Store:
                - isALog
                - storesCredentials
                - isEncrypted
                - isSigned

            Actor:
                - providesAuthentication

            Flow:
                - protocol
                - isEncrypted
                - isPublicNetwork
        -->

        <b-row v-show="!cellRef">
            <b-col>
                <p>Select an element on the graph to modify the properties</p>
            </b-col>
        </b-row>

        <b-form v-if="!!cellRef">
            <b-form-row>
                <b-col>
                    <b-form-group
                        id="name-group"
                        :label="cellRef.data.type === 'tm.Text' ? 'Text' : 'Name'"
                        label-for="name">
                        <b-form-textarea
                            id="name"
                            v-model="cellRef.data.name"
                            :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-row v-if="cellRef.data.type !== 'tm.Text'">
                <b-col>
                    <b-form-group
                        id="description-group"
                        label="Description"
                        label-for="description">
                        <b-form-textarea
                            id="description"
                            v-model="cellRef.data.description"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <div v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="outofscope-group">
                            <b-form-checkbox
                                id="outofscope"
                                v-model="cellRef.data.outOfScope"
                            >Out of Scope</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="reasonoutofscope-group"
                            label="Reason for out of scope"
                            label-for="reasonoutofscope">
                            <b-form-textarea
                                id="reasonoutofscope"
                                v-model="cellRef.data.reasonOutOfScope"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="cellRef.data.type === 'tm.Process'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="privilegelevel-group"
                            label="Privilege Level"
                            label-for="privilegelevel">
                            <b-form-input
                                id="privilegelevel"
                                v-model="cellRef.data.privilegeLevel"
                                type="text"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="cellRef.data.type === 'tm.Store'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isalog-group">
                            <b-form-checkbox
                                id="isalog"
                                v-model="cellRef.data.isALog"
                            >Is a Log</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="storesCredentials-group">
                            <b-form-checkbox
                                id="storesCredentials"
                                v-model="cellRef.data.storesCredentials"
                            >Stores Credentials</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isEncrypted-group">
                            <b-form-checkbox
                                id="isEncrypted"
                                v-model="cellRef.data.isEncrypted"
                            >Encrypted</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isSigned-group">
                            <b-form-checkbox
                                id="isSigned"
                                v-model="cellRef.data.isSigned"
                            >Signed</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="cellRef.data.type === 'tm.Actor'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="providesAuthentication-group">
                            <b-form-checkbox
                                id="providesAuthentication"
                                v-model="cellRef.data.providesAuthentication"
                            >Provides Authentication</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="cellRef.data.type === 'tm.Flow'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="protocol-group"
                            label="Protocol"
                            label-for="protocol">
                            <b-form-input
                                id="protocol"
                                v-model="cellRef.data.protocol"
                                type="text"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isEncrypted-group">
                            <b-form-checkbox
                                id="isEncrypted"
                                v-model="cellRef.data.isEncrypted"
                            >Encrypted</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isPublicNetwork-group">
                            <b-form-checkbox
                                id="isPublicNetwork"
                                v-model="cellRef.data.isPublicNetwork"
                            >Public Network</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>
        </b-form>
    </div>
</template>

<style lang="scss">
label {
    font-size: 12px;
}
</style>

<script>
import { mapState } from 'vuex';

/**
 * TODO:
 * Note: The data is bound, but the UI is only updated when the unselected event happens.  We may want to find a way to force this as needed.
 */
export default {
    name: 'TdGraphProperties',
    computed: mapState({
        cellRef: (state) => state.cell.ref
    })
};
</script>
