import React, { useEffect, useState } from 'react'
import { Button, ChakraProvider, Checkbox, FormControl, FormHelperText, FormLabel, Grid, GridItem, HStack, Heading, Icon, IconButton, Input, InputGroup, InputLeftAddon, Radio, RadioGroup, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea, VStack } from '@chakra-ui/react';
import { Box } from '@mui/material'
import { IdentificationBadge, Envelope, Phone ,Calendar, Password, Eye, EyeSlash, HouseLine, Drop, Gauge, CalendarCheck , Bed     } from '@phosphor-icons/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



//Style for Modal
const style = {
    // position: 'relative',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: {lg : '75rem' , xs : '40rem'},
    minHeight : '35rem',
    maxHeight : '68rem',
    backgroundColor: 'rgb(214, 205, 205)',
    borderRadius: '2rem',
    borderLeft: '2px solid rgb(214,205,205)',
    borderBottom: '2px solid rgb(214,205,205)',
    boxShadow: 24,
    p: 4,
    '@media only screen and (max-width : 767px)' : {
        width: '36rem',
        height : '50rem',
        overflowY : 'scroll',
    },
    '& .chakra-radio__control' : {
        borderColor: '#d22228'
    }
    
};

const Registration = (props) => {
    axios.defaults.withCredentials=true;

    // State variables
    // Check for Invalid Registration
    const [isDonorValid , setIsDonorValid] = useState({
        firstName : false,
        lastName : false,
        phoneNumber : false,
        address : false,
    })

    //Donor Information
    const [donorInfo, setDonorInfo] = useState({
        firstName : '',
        lastName : '',
        dob : '',
        bloodGroup : '',
        gender: '',
        lastDonated : '',
        isThalassemia : false,
        phoneNumber : '',
        address : '',
    })
    // Check for Invalid Registration
    const [isRecipientValid , setIsRecipientValid] = useState({
        firstName : false,
        lastName : false,
        phoneNumber : false,
        address : false,
    })

    //Donor Information
    const [recipientInfo, setRecipientInfo] = useState({
        firstName : '',
        lastName : '',
        dob : '',
        phoneNumber : '',
        address : '',
        gender: '',
        bloodGroup : '',
        isThalassemia : false,
        hasCancer : false,
    })
    
    // Daily Count 
    const [dailyCount, setDailyCount] = useState()
    // Page Reloader flag
    const [reload,setReload] = useState(true)

    // Handlers
    //Handle State Change of Recipient Details
    const setRecipientDetails = (e) =>{
        let name = e.target.name
        let value = e.target.value
    

        switch(name){   
            case 'firstName':
                if(value.trim().length<3){
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break
            
            case 'lastName':
                if(value.trim().length < 3){
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : false    
                    }))
                }
                break

            case 'phoneNumber':
                if(value.trim().length !== 10 && value.trim() !== ''){
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'address':
                if(value.trim().length < 10){
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'hospitalName':
                if( value.trim().length <3 ){
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setIsRecipientValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break
            
            default:
                break
        }


        setRecipientInfo(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
        )
    }
    

     // Handle State Change of Donor Details
     const setDonorDetails = (e) =>{
        let name = e.target.name
        let value = e.target.value
        switch(name){
            case 'firstName' : 
                if (value.trim().length < 3){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break

            case 'lastName' : 
                if(value.trim().length < 3){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'phoneNumber' : 
                if(value.trim().length !== 10){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'address' : 
                if(value.trim().length < 10){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
        }
        setDonorInfo(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
        )
    }

    // Add Recipient
    const addRecipient =async () => {
        console.log('Adding Recipient')

        if(isRecipientValid.firstName || isRecipientValid.lastName || isRecipientValid.phoneNumber || isRecipientValid.address || recipientInfo.dob === '' || recipientInfo.bloodGroup === '' || recipientInfo.gender === ''){
            console.log('Check')
            toast.error('Please Enter the Recipient Details Correctly')
            return
        }

        const formData = new FormData()

        for(const key in recipientInfo){
            formData.append(key,recipientInfo[key])
        }

        try {   
            const res = await axios.post('http://192.168.29.55:8000/adminUser/admin_booking/', formData,{
                headers : {'X-CSRFToken': localStorage.getItem('csrfToken'),}
            })
            console.log(res)
            Swal.fire({
                text : res.data.success,
                icon : 'success'
            })
            setRecipientInfo({
                firstName : '',
                lastName : '',
                dob : '',
                phoneNumber : '',
                address : '',
                gender: '',
                bloodGroup : '',
                isThalassemia : false,
                hasCancer : false,
            })
            setIsRecipientValid({
                firstName : false,
                lastName : false,
                phoneNumber : false,
                address : false,
            })
            setReload(!reload)
        } catch (error) {
            toast.error(error.response.data.error || error.response.statusText)
            setReload(!reload)
        }
    }

    // Add Donors
    const addDonor = async () => {
        console.log('Adding Donors')
        if(isDonorValid.firstName || isDonorValid.lastName || isDonorValid.phoneNumber || isDonorValid.address || donorInfo.bloodGroup === '' || donorInfo.dob === '' || donorInfo.gender === ''){
            toast.error('Please Fill the Donor Details Correctly')
            return
        }

        const payload = {
            firstName : donorInfo.firstName,
            lastName : donorInfo.lastName,
            dob : donorInfo.dob,
            bloodGroup : donorInfo.bloodGroup,
            gender: donorInfo.gender,
            lastDonated : donorInfo.lastDonated ? donorInfo.lastDonated : null,
            isThalassemia : donorInfo.isThalassemia,
            phoneNumber : donorInfo.phoneNumber,
            address : donorInfo.address,
        }

        try {
            const res = await axios.post('http://192.168.29.55:8000/adminUser/admin_donor_registration/', JSON.stringify(payload),{
                headers : {'X-CSRFToken': localStorage.getItem('csrfToken'),}
            })
            console.log(res)
            Swal.fire({
                text : res.data.success,
                icon : 'success'
            })
            setDonorInfo({
                firstName : '',
                lastName : '',
                dob : '',
                bloodGroup : '',
                gender: '',
                lastDonated : '',
                isThalassemia : false,
                phoneNumber : '',
                address : '',
            })
            setIsDonorValid({
                firstName : false,
                lastName : false,
                phoneNumber : false,
                address : false,
            })
        } catch (error) {
            toast.error(error.response.statusText || error.response.data.error)
        }
    }


    // API Calls
    const getCount = async () => {
        try{
            const res = await axios.get('http://192.168.29.55:8000/adminUser/get_total_cquantity/');
            console.log(res)
            setDailyCount(res.data.quantity)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() =>{
        getCount();
    },[reload])



    return (
        <>

                    <Box sx={style}>
                        <ChakraProvider>
                            
                            <Tabs isFitted variant='solid-rounded' colorScheme='red' size='md'>
                                <TabList mb='2em' >
                                    <Tab fontSize={{lg: '1.8rem', base: '1.2rem'}}>Recipient Registration</Tab>
                                    <Tab fontSize={{lg: '1.8rem', base: '1.2rem'}}>Donor Registration</Tab>
                                </TabList>
                                <TabPanels>
                                {/* Recipient Panel */}
                                    <TabPanel>
                                        <VStack>
                                            <Heading> Total Slots Left is : {dailyCount} </Heading>
                                        </VStack>
                                        <Grid mt={10} templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={10}>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='firstName'>Patient's First Name</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon height={30}>
                                                            <Icon as={IdentificationBadge } boxSize={8} weight="duotone" color="#ce2432" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' isInvalid={isRecipientValid.firstName}  focusBorderColor={isRecipientValid.firstName ? 'red.400' : 'green.300'} backgroundColor='red.50'  height={30} fontSize={14} type="text" name="firstName" required value={recipientInfo.firstName} onChange={e =>  setRecipientDetails(e)}  colorScheme='pink'/>
                                                    </InputGroup>
                                                    {isRecipientValid.firstName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='lastName'>Patient's Last Name</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon height={30}>
                                                            <Icon as={IdentificationBadge }  boxSize={8} weight="duotone" color="#ce2432" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' isInvalid={isRecipientValid.lastName} focusBorderColor={isRecipientValid.lastName  ? 'red.400' : 'green.300'} height={30} fontSize={14} type="text" name="lastName" value={recipientInfo.lastName} onChange={e =>  setRecipientDetails(e)} />
                                                    </InputGroup>
                                                    {isRecipientValid.lastName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                            <FormControl isRequired>
                                                <FormLabel fontSize={12} htmlFor='phoneNumber'>Patient's Phone Number</FormLabel>
                                                <InputGroup>
                                                    <InputLeftAddon height={30}>
                                                        <Icon as={Phone} boxSize={8} weight='duotone' color='#ce2432' />
                                                    </InputLeftAddon>
                                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="number" name="phoneNumber" value={recipientInfo.phoneNumber} onChange={e =>  setRecipientDetails(e)} isInvalid={isRecipientValid.phoneNumber} focusBorderColor={isRecipientValid.phoneNumber ? 'red.400' : 'green.300'} />
                                                </InputGroup>
                                                {isRecipientValid.phoneNumber ? <FormHelperText color="red" fontWeight={500}> Please Enter a Valid Phone Number </FormHelperText> : null}

                                            </FormControl>
                                        </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='gender' fontSize={12}> Gender </FormLabel>
                                                    <RadioGroup onChange={e => setRecipientInfo(prev => ({...prev , gender : e}))} name="gender" value={recipientInfo.gender}>
                                                        <Stack direction='row' pt={1} gap={9}> 
                                                            <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                                            <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                                            <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                                        </Stack>
                                                    </RadioGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='dob'>Patient's Date of Birth</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon height={30}>
                                                            <Icon as={Calendar }  boxSize={8} weight="duotone" color="#ce2432" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="date" name="dob" value={recipientInfo.dob} onChange={e =>  setRecipientDetails(e)} max={new Date().toISOString().split("T")[0]} />
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='blood' >Patient's Blood Group</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon height={30}>
                                                            <Icon as={Drop}  boxSize={8} weight='duotone' color='#ce2432' />
                                                        </InputLeftAddon>
                                                        <Select placeholder='Select Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='bloodGroup' value={recipientInfo.bloodGroup} onChange={e =>  setRecipientDetails(e)}>
                                                            <option value='A+'>A Positive (A+)</option>
                                                            <option value='A-'>A Negative (A-)</option>
                                                            <option value='B+'>B Positive (B+)</option>
                                                            <option value='B-'>B Negative (B-)</option>
                                                            <option value='O+'>O Positive (O+)</option>
                                                            <option value='O-'>O Negative (O-)</option>
                                                            <option value='AB+'>AB Positive (AB+)</option>
                                                            <option value='AB-'>AB Negative (AB-)</option>
                                                        </Select>
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            
                                            <GridItem>
                                                <FormControl>
                                                    <FormLabel fontSize={12} htmlFor='hospitalName'>Hospital Name (Optional)</FormLabel>
                                                    <InputGroup >
                                                        <InputLeftAddon height={30}>
                                                            <Icon as={Bed} boxSize={8} weight='duotone' color='#ce2432' />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="text" name="hospitalName" value={recipientInfo.hospitalName} onChange={e =>  setRecipientDetails(e)} isInvalid={isRecipientValid.hospitalName} focusBorderColor={isRecipientValid.hospitalName ? 'red.400' : 'green.300'} />
                                                    </InputGroup>
                                                    {isRecipientValid.hospitalName ? <FormHelperText color="red" fontWeight={500}> Hospital Name can't be less than 3 Characters </FormHelperText> : null}

                                                </FormControl>
                                            </GridItem>

                                            <GridItem  colSpan={{lg : 2}}>
                                                <HStack >
                                                    <FormControl> 
                                                        <InputGroup>
                                                            <FormLabel htmlFor='isThalassemia' fontSize={{base : 10, lg : 15}}>Does Patient have  Thalassemia?</FormLabel>
                                                            <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia' isChecked={recipientInfo.isThalassemia}  onChange={e => setRecipientInfo(prevState => ({...prevState, isThalassemia : !prevState.isThalassemia}))} />
                                                        </InputGroup>
                                                    </FormControl>
                                                    
                                                    <FormControl > 
                                                        <InputGroup>
                                                            <FormLabel htmlFor='hasCancer' fontSize={{base : 10, lg : 15}}>Does Patient have Cancer?</FormLabel>
                                                            <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='hasCancer' isChecked={recipientInfo.hasCancer}  onChange={e => setRecipientInfo(prevState => ({...prevState, hasCancer : !prevState.hasCancer}))} />
                                                        </InputGroup>
                                                    </FormControl>
                                                </HStack>
                                            </GridItem>
                                            <GridItem colSpan={{ lg : 2}}>
                                                    <FormControl isRequired>
                                                        <FormLabel fontSize={12} htmlFor='address'>Patient's Address</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon className='address' height={20}>
                                                                <Icon as={HouseLine}  boxSize={8} weight='duotone' color='#ce2432' />
                                                            </InputLeftAddon>
                                                            <Textarea variant='outline' backgroundColor='red.50' fontSize={14} resize='none' name="address" value={recipientInfo.address} onChange={e =>  setRecipientDetails(e)} isInvalid={isRecipientValid.address} focusBorderColor={isRecipientValid.address ? 'red.400' : 'green.300'} />
                                                        </InputGroup>
                                                    </FormControl>
                                            </GridItem>
                                        </Grid>
                                        <VStack>
                                            <Button 
                                                color="black" bg="#d7141450" 
                                                _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                className='reg_btn'
                                                mt={10}
                                                height='30px'
                                                width='160px'
                                                fontSize='16px'
                                                fontWeight='400'
                                                onClick={addRecipient}
                                            > Register Patient </Button>
                                        </VStack>
                                    </TabPanel>
                                    
                                    {/* Donor Panel */}
                                    <TabPanel>
                                        <Grid mt={10} templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={10}>                      
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='firstName'>First Name</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={IdentificationBadge} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.firstName ? 'red.400' : 'green.300'} isInvalid={isDonorValid.firstName} height={30} fontSize={14} type="text" name="firstName" value={donorInfo.firstName} onChange={e => setDonorDetails(e)} colorScheme='pink' />
                                                    </InputGroup>
                                                    {isDonorValid.firstName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='lastName'>Last Name</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={IdentificationBadge} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.lastName ? 'red.400' : 'green.300'} isInvalid={isDonorValid.lastName} height={30} fontSize={14} type="text" name="lastName" value={donorInfo.lastName} onChange={e => setDonorDetails(e)} />
                                                    </InputGroup>
                                                    {isDonorValid.lastName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='gender'> Gender </FormLabel>
                                                    <RadioGroup onChange={e => setDonorInfo(prev => ({ ...prev, gender: e }))} name="gender" value={donorInfo.gender}>
                                                        <Stack direction='row' pt={4} gap={9}>
                                                            <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                                            <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                                            <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                                        </Stack>
                                                    </RadioGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='dob'>Date of Birth</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Calendar} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} type="date" name="dob" value={donorInfo.dob} onChange={e => setDonorDetails(e)} max={new Date().toISOString().split("T")[0]}/>
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='bloodGroup'>Blood Group</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Drop} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        </InputLeftAddon>
                                                        <Select placeholder='Select Your Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='bloodGroup' value={donorInfo.bloodGroup} onChange={e => setDonorDetails(e)}>
                                                            <option value='A+'>A Positive (A+)</option>
                                                            <option value='A-'>A Negative (A-)</option>
                                                            <option value='B+'>B Positive (B+)</option>
                                                            <option value='B-'>B Negative (B-)</option>
                                                            <option value='O+'>O Positive (O+)</option>
                                                            <option value='O-'>O Negative (O-)</option>
                                                            <option value='AB+'>AB Positive (B+)</option>
                                                            <option value='AB-'>AB Negative (AB-)</option>
                                                        </Select>
                                                    </InputGroup>

                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl>
                                                    <FormLabel fontSize={12} htmlFor='lastDonated'>Last Donated (Optional) </FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={CalendarCheck} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} type="date" name="lastDonated" value={donorInfo.lastDonated} onChange={e => setDonorDetails(e)} max={new Date().toISOString().split("T")[0]} />
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl paddingTop={10}>
                                                    <InputGroup>
                                                        <FormLabel fontSize={12} htmlFor='isThalassemia'>Do you have Thalassemia?</FormLabel>
                                                        <Checkbox size='lg' colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia' isChecked={donorInfo.isThalassemia} onChange={e => setDonorInfo(prevState => ({ ...prevState, isThalassemia: !prevState.isThalassemia }))} />
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='phoneNumber'>Phone</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Phone} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.phoneNumber ? 'red.400' : 'green.300'} isInvalid={isDonorValid.phoneNumber} height={30} fontSize={14} type="number" name="phoneNumber" value={donorInfo.phoneNumber} onChange={e => setDonorDetails(e)} />
                                                    </InputGroup>
                                                    {isDonorValid.phoneNumber ? <FormHelperText color="red" fontWeight={500}>Please Enter a Valid Phone Number  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 1, lg: 2 }}>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize={12} htmlFor='address'>Address</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' className='address' height={20}>
                                                            <Icon as={HouseLine} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        </InputLeftAddon>
                                                        <Textarea variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.address ? 'red.400' : 'green.300'} isInvalid={isDonorValid.address} fontSize={14} resize='none' name="address" value={donorInfo.address} onChange={e => setDonorDetails(e)} />
                                                    </InputGroup>
                                                    {isDonorValid.address ? <FormHelperText color="red" fontWeight={500}> Address is too Short, Minimum 10 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                        </Grid>

                                        <VStack>
                                            <Button 
                                                color="black" bg="#d7141450" 
                                                _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                className='reg_btn'
                                                mt={10}
                                                height='30px'
                                                width='160px'
                                                fontSize='16px'
                                                fontWeight='400'
                                                onClick={addDonor}
                                            > Register Donor </Button>
                                        </VStack>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                            
                            
                        </ChakraProvider>
                    </Box>
               
        </>
    )
}

export default Registration