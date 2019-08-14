<?php

class Hardik_Ajaxcart_Model_Response extends Varien_Object
{
    public function send()
    {
        Zend_Json::$useBuiltinEncoderDecoder = true;
        if ($this->getError()) $this->setR('error');
        else $this->setR('success');
        Mage::app()->getFrontController()->getResponse()->setBody(Zend_Json::encode($this->getData()));
    }

    public function addUpdatedBlocks(&$_response) {
        $updated_blocks = unserialize(Mage::getStoreConfig('ajaxcart/general/update_blocks'));

        if ($updated_blocks) {
            $layout = Mage::getSingleton('core/layout');
            $res = array();

            foreach($updated_blocks['id'] as $index=>$block) {
                $value = $layout->getBlock($updated_blocks['xml'][$index]);

                if($value) {
                    $tmp['key']   =   $block;
                    $tmp['value'] =   $value->toHtml();
                    $res[] = $tmp;
                }
            }
            if(!empty($res)) {
                $_response->setUpdateBlocks($res);
            }
        }

    }
}