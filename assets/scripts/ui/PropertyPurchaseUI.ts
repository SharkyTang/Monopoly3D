import {
    _decorator,
    Component,
    Node,
    Label
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PropertyPurchaseUI')
export class PropertyPurchaseUI extends Component {

    @property(Node)
    panel: Node | null = null;

    @property(Label)
    propertyNameLabel: Label | null = null;

    @property(Label)
    priceLabel: Label | null = null;

    protected start(): void {

        this.hide();

        console.log(
            '[PropertyPurchaseUI] Ready. Purchase panel hidden.'
        );
    }

    public show(
        propertyName: string,
        price: number
    ): void {

        if (this.propertyNameLabel) {
            this.propertyNameLabel.string =
                propertyName;
        }

        if (this.priceLabel) {
            this.priceLabel.string =
                `Price: ${price}`;
        }

        if (this.panel) {
            this.panel.active = true;
        }

        console.log(
            `[PropertyPurchaseUI] Showing purchase panel: ${propertyName}, price=${price}`
        );
    }

    public hide(): void {

        if (this.panel) {
            this.panel.active = false;
        }
    }
}