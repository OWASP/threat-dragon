<template>
    <div>
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

        <b-form @submit="onSubmit">
            <b-form-row>
                <b-col>
                    <b-form-group
                        id="name-group"
                        label="Name"
                        label-for="name">
                        <b-form-input
                            id="name"
                            v-model="data.name"
                            type="text"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-row>
                <b-col>
                    <b-form-group
                        id="description-group"
                        label="Description"
                        label-for="description">
                        <b-form-textarea
                            id="description"
                            v-model="data.description"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <div v-if="!data.isTrustBoundary">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="outofscope-group">
                            <b-form-checkbox
                                id="outofscope"
                                v-model="data.outOfScope"
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
                                v-model="data.reasonOutOfScope"
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="data.type === 'tm.Process'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="privilegelevel-group"
                            label="Privilege Level"
                            label-for="privilegelevel">
                            <b-form-input
                                id="privilegelevel"
                                v-model="data.privilegeLevel"
                                type="text"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="data.type === 'tm.Store'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="isalog-group">
                            <b-form-checkbox
                                id="isalog"
                                v-model="data.isALog"
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
                                v-model="data.storesCredentials"
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
                                v-model="data.isEncrypted"
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
                                v-model="data.isSigned"
                            >Signed</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="data.type === 'tm.Actor'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="providesAuthentication-group">
                            <b-form-checkbox
                                id="providesAuthentication"
                                v-model="data.providesAuthentication"
                            >Provides Authentication</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <div v-if="data.type === 'tm.Flow'">
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="protocol-group"
                            label="Protocol"
                            label-for="protocol">
                            <b-form-input
                                id="protocol"
                                v-model="data.protocol"
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
                                v-model="data.isEncrypted"
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
                                v-model="data.isPublicNetwork"
                            >Public Network</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>
        </b-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * TODO:
 *  - Empty state (nothing selected)
 *  - Entity
 *  - Flow / Trust Boundary (traditional)
 * 
 * Because of the way the graph events and creation were designed, it'd be best to use a store for the selected element / type
 * This may also allow for easier testing of the component in isolation
 * 
 * Note: The data is bound, but the UI is only updated when the unselected event happens.  We may want to find a way to force this as needed.
 * 
 */
export default {
    name: 'TdGraphProperties',
    computed: mapState({
        // TODO: Simplify in the store, no need for passing around data and reference separately.  
        // Store can simply have the "selected" property and hold the reference to the selected cell
        data: (state) => state.cell.data,
        cellRef: (state) => state.cell.ref
    }),
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            console.log('Submitted...');
        }
    }
};
</script>
